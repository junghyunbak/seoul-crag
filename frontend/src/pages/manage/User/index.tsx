import { useRef } from 'react';

import {
  useFetchMe,
  useMutateUploadImage,
  useMutateUserEmail,
  useMutateUserImage,
  useMutateUserNickname,
} from '@/hooks';

import { Avatar, Box, Button } from '@mui/material';

import { Molecules } from '@/components/molecules';

/**
 * 이미지 업로드 api를 분리, 링크를 받아서 추가. 암장 정보도 마찬가지.
 */
export default function User() {
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

  const handleRemoveProfileImage = async () => {
    await updateUserImageMutation.mutateAsync({
      url: null,
    });
  };

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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
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
        <Button onClick={handleRemoveProfileImage}>이미지 삭제</Button>
      </Box>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

      <Molecules.AutoSaveTextField value={user.username} label="닉네임" onSave={handleNicknameChange} />
      <Molecules.AutoSaveTextField value={user.email} label="이메일" onSave={handleEmailChange} />
    </Box>
  );
}
