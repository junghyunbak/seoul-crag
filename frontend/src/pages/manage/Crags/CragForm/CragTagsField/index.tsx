import { useEffect } from 'react';
import { api } from '@/api/axios';
import { useFetchTags } from '@/hooks';
import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';
import { Box, Chip, Divider, Paper, Typography } from '@mui/material';
import { DefaultError, useMutation } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { autoUpdate, shift, useFloating } from '@floating-ui/react';

export function CragTagsField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { refs, floatingStyles, update } = useFloating({
    placement: 'bottom-start',
    open: isMenuOpen,
    onOpenChange: setIsMenuOpen,
    middleware: [shift({ crossAxis: true, padding: 16 })],
  });

  const {
    reference: { current: refRef },
    floating: { current: floatRef },
  } = refs;

  useEffect(() => {
    if (!refRef || !floatRef) {
      return;
    }

    const cleanup = autoUpdate(refRef, floatRef, update);

    return cleanup;
  }, [refRef, floatRef, update]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        floatRef instanceof HTMLElement &&
        !floatRef.contains(target) &&
        refRef instanceof HTMLElement &&
        !refRef.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return function cleanup() {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [floatRef, refRef]);

  const { tags } = useFetchTags();

  const addCragTagMutation = useMutation<void, DefaultError, Tag>({
    mutationFn: async ({ id }) => {
      await api.post(`gym-tags`, {
        gymId: crag.id,
        tagId: id,
      });
    },
    onSuccess: () => {
      revalidateCrag();
    },
  });

  const removeCragTagMutation = useMutation<void, DefaultError, Tag>({
    mutationFn: async ({ id }) => {
      await api.delete(`gym-tags/${crag.id}/${id}`);
    },
    onSuccess() {
      revalidateCrag();
    },
  });

  if (!tags) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="h6">암장 태그</Typography>

      <Box ref={refs.setReference} sx={{ transform: 'translateY(-100%)', pointerEvents: 'none' }}>
        <Paper
          sx={{
            width: '100%',
            transform: 'translateY(100%)',
            pointerEvents: 'auto',
            borderRadius: 1,
            cursor: 'pointer',
          }}
          onClick={() => setIsMenuOpen(true)}
        >
          <CragTagList crag={crag} readonly />
        </Paper>
      </Box>

      {isMenuOpen && (
        <Paper
          ref={refs.setFloating}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          style={{ ...floatingStyles, zIndex: 1000 }}
        >
          <CragTagList
            crag={crag}
            onClick={(tag) => {
              removeCragTagMutation.mutate(tag);
            }}
          />
          <Divider />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              width: '100%',
              alignItems: 'flex-start',
              p: 1,
              maxHeight: '50dvh',
              overflowY: 'auto',
            }}
          >
            {tags.map((tag) => {
              return (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  sx={{ flexShrink: 0 }}
                  size="small"
                  onClick={() => {
                    addCragTagMutation.mutate(tag);
                  }}
                />
              );
            })}
          </Box>
        </Paper>
      )}
    </Box>
  );
}

interface TagListProps {
  crag: Crag;
  readonly?: boolean;
  onClick?: (tag: Tag) => void;
}

function CragTagList({ crag, onClick, readonly = false }: TagListProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        width: '100%',
        p: 1,
        minHeight: 40,
      }}
    >
      {(crag.tags || []).map((tag) => {
        return (
          <Chip
            key={tag.id}
            label={tag.name}
            onDelete={
              readonly
                ? undefined
                : () => {
                    onClick?.(tag);
                  }
            }
            size="small"
          />
        );
      })}
    </Box>
  );
}
