import React from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Box, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SortableImageProps {
  id: string;
  file?: File;
  url?: string;
  onDelete?: (id: string) => void;
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

const DeleteButton = styled(IconButton)({
  position: 'absolute',
  top: 2,
  right: 2,
  backgroundColor: 'rgba(0,0,0,0.5)',
  color: 'white',
  padding: 4,
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});

export const SortableImage: React.FC<SortableImageProps> = ({ id, file, url, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const src = file ? URL.createObjectURL(file) : url;

  return (
    <Wrapper ref={setNodeRef} style={style}>
      {src && <PreviewImage src={src} alt={id} {...attributes} {...listeners} />}
      {url && (
        <DeleteButton
          size="small"
          onClick={() => {
            onDelete?.(id);
          }}
        >
          <CloseIcon fontSize="small" />
        </DeleteButton>
      )}
    </Wrapper>
  );
};
