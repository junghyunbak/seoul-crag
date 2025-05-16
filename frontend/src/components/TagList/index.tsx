import { Box, Chip } from '@mui/material';

interface TagListProps {
  tags: Tag[];
  readonly?: boolean;
  onClick?: (tag: Tag) => void;
  removePadding?: boolean;
}

export function TagList({ tags, onClick, readonly = false, removePadding = false }: TagListProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        width: '100%',
        p: removePadding ? undefined : 1,
        minHeight: 40,
      }}
    >
      {tags.map((tag) => {
        return (
          <Chip
            key={tag.id}
            label={tag.name}
            onDelete={
              readonly
                ? undefined
                : () => {
                    onClick?.(tag);
                  }
            }
            size="small"
          />
        );
      })}
    </Box>
  );
}
