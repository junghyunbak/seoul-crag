import { Avatar, Box, ButtonBase, Chip, Paper, Typography } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { cragFormContext } from '../index.context';
import { useFetchContributes, useFetchUsers } from '@/hooks';
import { createPortal } from 'react-dom';
import { autoUpdate, useFloating } from '@floating-ui/react-dom';
import { DefaultError, useMutation } from '@tanstack/react-query';
import { api } from '@/api/axios';

export function CragContributesField() {
  const { contributions } = useFetchContributes();

  return (
    <Box>
      <Box>
        {contributions?.map((contribution) => (
          <ContributionField key={contribution.id} contribution={contribution} />
        ))}
      </Box>
    </Box>
  );
}

function ContributionField({ contribution }: { contribution: Contribution }) {
  const { crag } = useContext(cragFormContext);

  const [isOpen, setIsOpen] = useState(false);

  const referenceRef = useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="h6">{contribution.name}</Typography>

      <Paper
        key={contribution.id}
        sx={{ minHeight: '40px', cursor: 'pointer' }}
        ref={referenceRef}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {crag.contributions.map((cragContribution) => {
          if (cragContribution.contribution.id !== contribution.id) {
            return null;
          }

          return <Chip key={cragContribution.id} size="small" label={cragContribution.user.username} />;
        })}
      </Paper>

      {isOpen && <RegisterContributionOverlay referenceRef={referenceRef} contribution={contribution} />}
    </Box>
  );
}

function RegisterContributionOverlay({
  referenceRef,
  contribution,
}: {
  referenceRef: React.RefObject<HTMLDivElement | null>;
  contribution: Contribution;
}) {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { users } = useFetchUsers();

  const { refs, update, floatingStyles } = useFloating({
    placement: 'bottom-start',
  });

  const createGymUserContributionMutation = useMutation<
    void,
    DefaultError,
    {
      contributionId: string;
      userId: string;
      gymId: string;
      description: string;
    }
  >({
    mutationFn: async ({ contributionId, userId, gymId, description }) => {
      await api.post('/gym-user-contribution', {
        contributionId,
        userId,
        gymId,
        description,
      });
    },
  });

  useEffect(() => {
    refs.setReference(referenceRef.current);
  }, [referenceRef, refs]);

  useEffect(() => {
    if (!referenceRef.current || !refs.floating.current) {
      return;
    }

    const cleanup = autoUpdate(referenceRef.current, refs.floating.current, update);

    return cleanup;
  }, [referenceRef, refs, update]);

  return createPortal(
    <Paper sx={{ display: 'flex', flexDirection: 'column' }} ref={refs.setFloating} style={floatingStyles}>
      {users?.map((user) => (
        <ButtonBase
          key={user.id}
          sx={(theme) => ({
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            p: 1,
            borderRadius: 1,
            width: '100%',
            justifyContent: 'flex-start',
            '&:hover': {
              background: theme.palette.grey[200],
            },
          })}
          onClick={async () => {
            await createGymUserContributionMutation.mutateAsync({
              userId: user.id,
              gymId: crag.id,
              contributionId: contribution.id,
              description: '',
            });
            revalidateCrag();
          }}
        >
          <Avatar sx={{ width: 25, height: 25 }} src={user.profile_image || ''}>
            {user.username}
          </Avatar>
          <Typography>
            {user.username}
            <Typography component="span" sx={(theme) => ({ color: theme.palette.text.secondary })}>
              {'#' + user.id.slice(0, 6)}
            </Typography>
          </Typography>
        </ButtonBase>
      ))}
    </Paper>,
    document.body
  );
}
