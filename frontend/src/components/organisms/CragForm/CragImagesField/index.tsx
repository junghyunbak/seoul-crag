import { useEffect, useState, useContext } from 'react';

import { Typography, Box } from '@mui/material';

import {
  useFetchImages,
  useMutateCragImageAdd,
  useMutateCragImageDelete,
  useMutateCragImageReorder,
  useMutateCragImageUpdate,
  useMutateUploadImage,
} from '@/hooks';

import { ImageUploader } from './ImageUploader';
import { UploadModal } from './UploadModal';

import { cragFormContext } from '@/components/organisms/CragForm/index.context';

interface CragImagesFieldProps {
  imageType?: ImageType;
}

export function CragImagesField({ imageType = 'interior' }: CragImagesFieldProps) {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const [images, setImages] = useState<Image[]>([]);

  const [openModal, setOpenModal] = useState(false);

  /**
   * selectedImage
   *
   * null : 새로운 이미지 추가
   * not null : 기존 값 수정
   */
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [selectFile, setSelectFile] = useState<File | null>(null);

  const [sourceText, setSourceText] = useState('');

  const { images: fetchImages, refetch } = useFetchImages(crag.id, imageType);

  useEffect(() => {
    if (fetchImages) setImages(fetchImages);
  }, [fetchImages]);

  const { cragImageAddMutation } = useMutateCragImageAdd({
    onSettled: () => {
      refetch();
      revalidateCrag();
    },
  });
  const { cragImageReorderMutation } = useMutateCragImageReorder({
    onSettled: () => {
      refetch();
      revalidateCrag();
    },
  });
  const { cragImageDeleteMutation } = useMutateCragImageDelete({
    onSettled: () => {
      refetch();
      revalidateCrag();
    },
  });
  const { cragImageUpdateMutation } = useMutateCragImageUpdate({
    onSettled: () => {
      refetch();
      revalidateCrag();
    },
  });
  const { uploadImageMutation } = useMutateUploadImage({});

  const handleUploadClick = () => {
    setSelectedImage(null);
    setOpenModal(true);
  };

  const handleEditImage = (image: Image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleDeleteFile = () => {
    setSelectFile(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSourceTextChange = (value: string) => {
    setSourceText(value);
  };

  const handleFilePick = (file: File) => {
    setSelectFile(file);
  };

  const handleUpdateImageInfo = async () => {
    if (!selectedImage) {
      return;
    }

    await cragImageUpdateMutation.mutateAsync({ cragId: crag.id, imageId: selectedImage.id, source: sourceText });

    setOpenModal(false);
  };

  const handleSaveImage = async () => {
    if (!selectFile) return;

    const form = new FormData();

    form.append('file', selectFile);

    const url = await uploadImageMutation.mutateAsync({ form });

    await cragImageAddMutation.mutateAsync({ cragId: crag.id, url, source: sourceText, type: imageType });

    setOpenModal(false);
    setSelectFile(null);
  };

  const handleDeleteImage = async () => {
    if (!selectedImage) {
      return;
    }

    const confirmed = window.confirm('정말 삭제하시겠습니까?');

    if (!confirmed) return;

    await cragImageDeleteMutation.mutateAsync({ cragId: crag.id, imageId: selectedImage.id });

    setOpenModal(false);
  };

  const handleReorderImage = (nextImages: Image[]) => {
    setImages(nextImages);

    cragImageReorderMutation.mutate({ cragId: crag.id, imageType, images: nextImages });
  };

  const imageUploadFieldTitle = (() => {
    switch (imageType) {
      case 'interior':
        return '암장 내부 이미지';
      case 'shower':
        return '샤워실 이미지';
      default:
      case 'thumbnail':
        return '';
    }
  })();

  return (
    <Box>
      <Typography variant="h6">{imageUploadFieldTitle}</Typography>
      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
        * jpeg, jpg, png 확장자만 업로드 가능합니다.
        <br />* 최대 20MB 크기의 사진을 업로드 할 수 있으며 올린 파일은 압축됩니다.
      </Typography>

      <ImageUploader
        images={images}
        onUploadClick={handleUploadClick}
        onEditImage={handleEditImage}
        onReorder={handleReorderImage}
      />

      {selectedImage ? (
        <UploadModal selectImage={selectedImage} selectFile={selectFile} open={openModal} onClose={handleCloseModal}>
          <UploadModal.ImagePreview />
          <UploadModal.SourceInput onChangeValue={handleSourceTextChange} />
          <UploadModal.SaveButton onClick={handleUpdateImageInfo} />
          <UploadModal.DeleteButton onClick={handleDeleteImage} />
          <UploadModal.CloseButton onClick={handleCloseModal} />
        </UploadModal>
      ) : (
        <UploadModal selectImage={null} selectFile={selectFile} open={openModal} onClose={handleCloseModal}>
          <UploadModal.ImagePreview />
          <UploadModal.SourceInput onChangeValue={handleSourceTextChange} />
          <UploadModal.DeleteImage onClick={handleDeleteFile} />
          <UploadModal.FilePicker onPick={handleFilePick} />
          <UploadModal.SaveButton onClick={handleSaveImage} />
          <UploadModal.CloseButton onClick={handleCloseModal} />
        </UploadModal>
      )}
    </Box>
  );
}
