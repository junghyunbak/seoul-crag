import React, { useEffect, useRef, useState, useContext } from 'react';

import { Typography, Box, IconButton, styled } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { useFetchImages, useMutateImageAdd, useMutateImageDelete, useMutateImageReorder } from '@/hooks';

import { SortableImage } from './SortableImage';

const ImageWrapper = styled(Box)({
  width: 100,
  height: 100,
  flexShrink: 0,
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
});
interface CragImagesFieldProps {
  imageType?: ImageType;
}

export function CragImagesField({ imageType = 'interior' }: CragImagesFieldProps) {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const inputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<(File | Image)[]>([]);

  const { images: fetchImages, refetch } = useFetchImages(crag.id, imageType);

  useEffect(() => {
    if (!fetchImages) {
      return;
    }

    setImages(fetchImages);
  }, [fetchImages]);

  const { addImageMutation } = useMutateImageAdd({
    onSettled() {
      refetch();
      revalidateCrag();
    },
  });

  const { reorderImageMutation } = useMutateImageReorder({
    onSettled() {
      refetch();
      revalidateCrag();
    },
  });

  const { deleteImageMutation } = useMutateImageDelete({
    onSettled() {
      refetch();
      revalidateCrag();
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      setImages((prev) => [...prev, ...Array.from(files)]);

      for (const file of Array.from(files)) {
        const form = new FormData();

        form.append('file', file);
        form.append('type', imageType);

        addImageMutation.mutate({ cragId: crag.id, form });
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((image) => (image instanceof File ? image.name : image.id) === active.id);
      const newIndex = images.findIndex((image) => (image instanceof File ? image.name : image.id) === over?.id);

      const nextItems = arrayMove(images, oldIndex, newIndex);

      setImages(nextItems);

      reorderImageMutation.mutate({
        imageType,
        cragId: crag.id,
        nextItems,
      });
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    deleteImageMutation.mutate({
      cragId: crag.id,
      imageId,
    });
  };

  return (
    <Box>
      <Typography variant="h6">암장 내부 이미지</Typography>

      <Typography variant="caption">
        * jpeg, jpg, png 확장자만 업로드 가능합니다.
        <br />* 최대 20MB 크기의 사진을 업로드 할 수 있으며 올린 파일은 압축됩니다.
      </Typography>

      <Box
        sx={{
          WebkitOverflowScrolling: 'touch',
          width: '100%',
          overflow: 'auto',
          py: 2,
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToHorizontalAxis]}
        >
          <SortableContext
            items={images.map((image) => (image instanceof File ? image.name : image.id))}
            strategy={horizontalListSortingStrategy}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
              }}
            >
              {images.map((image) => {
                if (image instanceof File) {
                  return <SortableImage key={image.name} id={image.name} file={image} />;
                } else {
                  return <SortableImage key={image.id} id={image.id} url={image.url} onDelete={handleRemoveImage} />;
                }
              })}

              <ImageWrapper display="flex" alignItems="center" justifyContent="center" border="2px dashed #ccc">
                <IconButton onClick={handleUploadClick}>
                  <AddPhotoAlternateIcon />
                </IconButton>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </ImageWrapper>
            </Box>
          </SortableContext>
        </DndContext>
      </Box>
    </Box>
  );
}
