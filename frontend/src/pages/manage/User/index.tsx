import { useRef } from 'react';
import { FormTextField } from '@/components/FormTextField';
import { useFetchMe, useMutateUploadImage } from '@/hooks';
import { Avatar, Box } from '@mui/material';
import { useMutateUserEmail, useMutateUserImage, useMutateUserNickname } from '@/hooks/useMutateUser';

/**
 * 이미지 업로드 api를 분리, 링크를 받아서 추가. 암장 정보도 마찬가지.
 */
export function User() {
  const { user, refetch } = useFetchMe();

  const inputRef = useRef<HTMLInputElement>(null);

  const { uploadImageMutation } = useMutateUploadImage({});
  const { updateUserImageMutation } = useMutateUserImage({
    onSettled() {
      refetch();
    },
  });
  const { updateUserEmailMutation } = useMutateUserEmail({
    onSettled() {
      refetch();
    },
  });
  const { updateUserNicknameMutation } = useMutateUserNickname({
    onSettled() {
      refetch();
    },
  });

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const form = new FormData();

    const imageType: ImageType = 'thumbnail';

    form.append('file', files[0]);
    form.append('type', imageType);

    const url = await uploadImageMutation.mutateAsync({ form });

    await updateUserImageMutation.mutateAsync({
      url,
    });

    inputRef.current!.value = '';
  };

  const handleNicknameChange = async (nickname: string) => {
    updateUserNicknameMutation.mutate({ nickname });
  };

  const handleEmailChange = async (email: string) => {
    updateUserEmailMutation.mutate({ email });
  };

  if (!user) {
    return;
  }

  return (
    <Box
      sx={{ p: 2, width: '100%', height: '100%', overflow: 'scroll', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Avatar
        sx={{
          width: 56,
          height: 56,
          cursor: 'pointer',
        }}
        src={user.profile_image || ''}
        onClick={handleClick}
      >
        {user.username}
      </Avatar>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

      <FormTextField value={user.username} label="닉네임" onSave={handleNicknameChange} />

      <FormTextField value={user.email} label="이메일" onSave={handleEmailChange} />
    </Box>
  );
}
