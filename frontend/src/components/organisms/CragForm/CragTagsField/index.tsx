import { useEffect, useContext, useState } from 'react';

import { Box, Chip, Divider, Paper, Typography } from '@mui/material';

import { useFetchTags } from '@/hooks';

import { cragFormContext } from '@/components/organisms/CragForm/index.context';

import { DefaultError, useMutation } from '@tanstack/react-query';

import { autoUpdate, shift, useFloating } from '@floating-ui/react';

import { Molecules } from '@/components/molecules';

import { api } from '@/api/axios';

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
          <Molecules.TagList tags={crag.gymTags.map(({ tag }) => tag) || []} readonly />
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
          <Molecules.TagList
            tags={crag.gymTags.map(({ tag }) => tag) || []}
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
