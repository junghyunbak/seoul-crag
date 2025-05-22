import { api } from '@/api/axios';
import { Box, Button, Chip, Paper, TextField } from '@mui/material';
import { DefaultError, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useFetchContributes } from '@/hooks';

export function Contributions() {
  const [name, setName] = useState('');

  const { contributions, refetch } = useFetchContributes();

  const createContributionMutation = useMutation<void, DefaultError, Pick<Contribution, 'name'>>({
    mutationFn: async ({ name }) => {
      await api.post('/contribution', {
        name,
      });
    },
  });

  const deleteContributionMutation = useMutation<void, DefaultError, Pick<Contribution, 'id'>>({
    mutationFn: async ({ id }) => {
      await api.delete(`/contribution/${id}`);
    },
  });

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Paper sx={{ p: 1, minHeight: '40px' }}>
        {contributions?.map((contribution) => {
          return (
            <Chip
              key={contribution.id}
              label={contribution.name}
              size="small"
              onDelete={() => {
                const confirm = window.confirm('정말 삭제하시겠습니까?');

                if (!confirm) {
                  return;
                }

                deleteContributionMutation.mutate(
                  { id: contribution.id },
                  {
                    onSuccess: () => {
                      refetch();
                    },
                  }
                );
              }}
            />
          );
        })}
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField label="기여 종목 이름" onChange={(e) => setName(e.target.value)} value={name} />

        <Button
          variant="contained"
          onClick={async () => {
            if (!name) {
              alert('종목 이름을 입력하세요.');
              return;
            }

            await createContributionMutation.mutateAsync({ name });
            setName('');

            refetch();
          }}
        >
          기여 종목 추가
        </Button>
      </Box>
    </Box>
  );
}
