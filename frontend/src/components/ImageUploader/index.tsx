import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, styled } from '@mui/material';
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
import { SortableImage } from './SortableImage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { imagesScheme } from '@/schemas/image';

const ScrollContainer = styled(Box)({
  overflowX: 'auto',
  overflowY: 'hidden',
  whiteSpace: 'nowrap',
  WebkitOverflowScrolling: 'touch',
});

const ImageWrapper = styled(Box)({
  width: 100,
  height: 100,
  flexShrink: 0,
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
});

interface ImageUploaderProps {
  crag: Crag;
  imageType?: ImageType;
}

export function ImageUploader({ crag, imageType = 'interior' }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<(File | Image)[]>([]);

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['images', imageType, crag.id],
    queryFn: async () => {
      const { data } = await api.get(`/gym-images/${crag.id}/images/${imageType}`);

      const images = imagesScheme.parse(data);

      images.sort((a, b) => (a.order < b.order ? -1 : 1));

      return images;
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setImages(data);
  }, [data]);

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

        await api.post(`/gym-images/${crag.id}/images`, form);
      }

      queryClient.invalidateQueries({ queryKey: ['images', imageType, crag.id] });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((image) => (image instanceof File ? image.name : image.id) === active.id);
      const newIndex = images.findIndex((image) => (image instanceof File ? image.name : image.id) === over?.id);

      const nextItems = arrayMove(images, oldIndex, newIndex);

      setImages(nextItems);

      await api.post(`/gym-images/${crag.id}/images/reorder`, {
        type: imageType,
        orderedIds: nextItems.filter((image) => 'id' in image).map((image) => image.id),
      });

      queryClient.invalidateQueries({ queryKey: ['images', imageType, crag.id] });
    }
  };

  const handleRemoveImage = async (id: string) => {
    console.log('삭제!!');

    await api.delete(`/gym-images/${crag.id}/images/${id}`);

    queryClient.invalidateQueries({ queryKey: ['images', imageType, crag.id] });
  };

  return (
    <ScrollContainer px={1} py={2}>
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
          <Box display="flex" gap={2} minWidth="fit-content">
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
    </ScrollContainer>
  );
}
