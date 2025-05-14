import { api } from '@/api/axios';
import { useFetchTags } from '@/hooks';
import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';
import { Box, Checkbox, Chip, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { DefaultError, useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

export function CragTagsField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { tags } = useFetchTags();

  const addCragTagMutation = useMutation<void, DefaultError, Tag>({
    mutationFn: async ({ id }) => {
      await api.post(`gym-tags`, {
        gymId: crag.id,
        tagId: id,
      });
    },
  });

  const removeCragTagMutation = useMutation<void, DefaultError, Tag>({
    mutationFn: async ({ id }) => {
      await api.delete(`gym-tags/${crag.id}/${id}`);
    },
  });

  if (!tags) {
    return null;
  }

  return (
    <Box>
      <Typography>태그 추가</Typography>

      <FormGroup sx={{ display: 'flex', flexDirection: 'column' }}>
        {tags.map((tag) => {
          const isExist = crag.tags?.some((cragTag) => cragTag.id === tag.id);

          return (
            <FormControlLabel
              key={tag.id}
              control={
                <Checkbox
                  checked={isExist}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      removeCragTagMutation.mutate(tag, {
                        onSuccess() {
                          revalidateCrag();
                        },
                      });
                    } else {
                      addCragTagMutation.mutate(tag, {
                        onSuccess() {
                          revalidateCrag();
                        },
                      });
                    }
                  }}
                />
              }
              label={tag.name}
            />
          );
        })}
      </FormGroup>

      {crag.tags?.map((tag) => {
        return <Chip key={tag.id} label={tag.name} />;
      })}
    </Box>
  );
}
