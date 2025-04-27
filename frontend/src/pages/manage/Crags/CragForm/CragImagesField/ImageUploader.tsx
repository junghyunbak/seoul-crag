import { Box, IconButton, styled } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

interface ImageUploaderProps {
  images: Image[];
  onUploadClick: () => void;
  onEditImage: (image: Image) => void;
  onReorder: (nextItems: Image[]) => void;
}

const ImageWrapper = styled(Box)({
  width: 100,
  height: 100,
  flexShrink: 0,
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
});

export function ImageUploader({ images, onUploadClick, onEditImage, onReorder }: ImageUploaderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);

    const nextItems = [...images];

    const moved = nextItems.splice(oldIndex, 1)[0];

    nextItems.splice(newIndex, 0, moved);

    onReorder(nextItems);
  };

  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%', overflow: 'auto', py: 2 }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis]}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <SortableContext
            items={images.map((img) => (img instanceof File ? img.name : img.id))}
            strategy={horizontalListSortingStrategy}
          >
            {images.map((image) => (
              <SortableImage key={image.id} image={image} onEdit={onEditImage} />
            ))}
          </SortableContext>

          <ImageWrapper display="flex" alignItems="center" justifyContent="center" border="2px dashed #ccc">
            <IconButton onClick={onUploadClick}>
              <AddPhotoAlternateIcon />
            </IconButton>
          </ImageWrapper>
        </Box>
      </DndContext>
    </Box>
  );
}

interface SortableImageProps {
  image: Image;
  onEdit: (image: Image) => void;
}

const Wrapper = styled(Box)({
  width: 100,
  height: 100,
  flexShrink: 0,
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
  cursor: 'grab',
});

const PreviewImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

const EditButton = styled(IconButton)({
  position: 'absolute',
  bottom: 2,
  right: 2,
  backgroundColor: 'rgba(0,0,0,0.5)',
  color: 'white',
  padding: 4,
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});

export const SortableImage: React.FC<SortableImageProps> = ({ image, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });

  return (
    <Wrapper
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <PreviewImage src={image.url} {...attributes} {...listeners} />
      <EditButton
        size="small"
        onClick={() => {
          onEdit(image);
        }}
      >
        <EditIcon fontSize="small" />
      </EditButton>
    </Wrapper>
  );
};
