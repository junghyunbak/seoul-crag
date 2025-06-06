import { useMutateCragThumbnailUpdate, useMutateUploadImage } from '@/hooks';
import { cragFormContext } from '@/components/organisms/CragForm/index.context';
import { Avatar, Box, Typography } from '@mui/material';
import { useContext, useRef } from 'react';

export function CragThumbnailField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const inputRef = useRef<HTMLInputElement>(null);

  const { uploadImageMutation } = useMutateUploadImage({});
  const { cragThumbnailUpdateMutation } = useMutateCragThumbnailUpdate({
    onSettled() {
      revalidateCrag();
    },
  });

  const handleAvatarClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const form = new FormData();

    const imageType: ImageType = 'thumbnail';

    form.append('file', files[0]);
    form.append('type', imageType);

    const url = await uploadImageMutation.mutateAsync({ form });

    await cragThumbnailUpdateMutation.mutateAsync({ cragId: crag.id, url });

    inputRef.current!.value = '';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Typography variant="h6">썸네일 이미지</Typography>
      <Typography variant="caption">스토리 좌측 상단에 사용됩니다.</Typography>
      <Avatar
        src={crag.thumbnail_url || ''}
        onClick={handleAvatarClick}
        sx={{
          cursor: 'pointer',
        }}
      >
        {crag.name}
      </Avatar>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
    </Box>
  );
}
