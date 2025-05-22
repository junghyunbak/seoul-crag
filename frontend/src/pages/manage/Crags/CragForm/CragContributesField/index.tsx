import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useContext, useState } from 'react';
import { cragFormContext } from '../index.context';
import { useFetchContributes, useFetchUsers } from '@/hooks';
import { DefaultError, useMutation } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { isAfter } from 'date-fns';

export function CragContributesField() {
  const { contributions } = useFetchContributes();

  return (
    <Box>
      <Box>
        {contributions?.map((contribution) => (
          <>
            <ContributionField key={contribution.id} contribution={contribution} />
            <CreateContributionButton contribution={contribution} />
          </>
        ))}
      </Box>
    </Box>
  );
}

interface ContributionFieldProps {
  contribution: Contribution;
}

function ContributionField({ contribution }: ContributionFieldProps) {
  const { crag } = useContext(cragFormContext);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="h6">{contribution.name}</Typography>

      <Box
        key={contribution.id}
        sx={{ minHeight: '40px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 1 }}
      >
        {crag.contributions
          .sort((a, b) => (isAfter(a.created_at, b.created_at) ? -1 : 1))
          .map((cragContribution) => {
            if (cragContribution.contribution.id !== contribution.id) {
              return null;
            }

            return <ContributionFieldItem key={cragContribution.id} cragContribution={cragContribution} />;
          })}
      </Box>
    </Box>
  );
}

interface ContributionFieldItemProps {
  cragContribution: Crag['contributions'][number];
}

function ContributionFieldItem({ cragContribution }: ContributionFieldItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    user: { username, profile_image },
    description,
  } = cragContribution;

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Box>
      <Card sx={{ display: 'flex', alignItems: 'center' }} onClick={() => setIsOpen(true)}>
        <CardMedia sx={{ p: 2 }}>
          <Avatar src={profile_image || ''}>{username[0]}</Avatar>
        </CardMedia>

        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h5">{username}</Typography>
          <Typography>{description}</Typography>
        </CardContent>
      </Card>

      <EditContributionDialog isOpen={isOpen} onClose={handleClose} cragContribution={cragContribution} />
    </Box>
  );
}

interface EditContributionDialogProps {
  isOpen: boolean;
  onClose(): void;
  cragContribution: Crag['contributions'][number];
}

function EditContributionDialog({ isOpen, onClose, cragContribution }: EditContributionDialogProps) {
  const { revalidateCrag } = useContext(cragFormContext);

  const [description, setDescription] = useState(cragContribution.description);

  const deleteGymUserContributionMutation = useMutation({
    mutationFn: async (contributionId: string) => {
      await api.delete(`/gym-user-contribution/${contributionId}`);
    },
  });

  const updateGymUserContributionMutation = useMutation({
    mutationFn: async ({ contributionId, description }: { contributionId: string; description: string }) => {
      await api.patch(`/gym-user-contribution/${contributionId}`, {
        description,
      });
    },
  });

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>기여 수정</DialogTitle>

      <DialogContent>
        <TextField multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </DialogContent>

      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button color="info" onClick={onClose}>
          닫기
        </Button>
        <Box>
          <Button
            color="error"
            onClick={async () => {
              const confirm = window.confirm('정말 삭제하시겠습니까?');

              if (!confirm) {
                return;
              }

              await deleteGymUserContributionMutation.mutateAsync(cragContribution.id);

              revalidateCrag();

              onClose();
            }}
          >
            삭제
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              await updateGymUserContributionMutation.mutateAsync({ contributionId: cragContribution.id, description });

              revalidateCrag();

              onClose();
            }}
          >
            수정
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

interface CreateContributionButtonProps {
  contribution: Contribution;
}

function CreateContributionButton({ contribution }: CreateContributionButtonProps) {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [selectUser, setSelectUser] = useState<User | null>(null);
  const [description, setDescription] = useState('');

  const { users } = useFetchUsers();

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

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        기여 추가
      </Button>

      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>기여 추가</DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box>
            <Typography>{`선택된 사용자 : ${
              selectUser ? `${selectUser.username}#${selectUser.id.slice(0, 6)}` : '(없음)'
            }`}</Typography>
          </Box>

          <Paper sx={{ overflowY: 'auto', position: 'relative', maxHeight: '50dvh' }}>
            <Box
              sx={(theme) => ({
                display: 'flex',
                gap: 1,
                p: 1,
                alignItems: 'center',
                position: 'sticky',
                zIndex: 1,
                top: 0,
                background: theme.palette.background.paper,
              })}
            >
              <SearchIcon />
              <TextField variant="standard" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {users
                ?.filter((user) => {
                  return user.username.includes(keyword) || user.id.slice(0, 6).includes(keyword);
                })
                .map((user) => (
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
                    onClick={() => {
                      setSelectUser(user);
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
            </Box>
          </Paper>

          <TextField
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              width: '100%',
            }}
          />
        </DialogContent>

        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="text" color="info" onClick={handleClose}>
            닫기
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!selectUser) {
                alert('기여를 추가할 유저를 선택하세요.');
                return;
              }

              if (!description) {
                alert('기여 설명을 최소 1자 이상 입력하세요.');
                return;
              }

              await createGymUserContributionMutation.mutateAsync({
                userId: selectUser.id,
                gymId: crag.id,
                contributionId: contribution.id,
                description,
              });

              revalidateCrag();

              setSelectUser(null);
              setDescription('');
              handleClose();
            }}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
