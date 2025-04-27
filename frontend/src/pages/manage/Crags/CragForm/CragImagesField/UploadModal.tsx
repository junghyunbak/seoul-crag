// UploadModal.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';

interface UploadModalContextType {
  selectImage: Image | null;
  selectFile: File | null;
}

const UploadModalContext = createContext<UploadModalContextType>({ selectFile: null, selectImage: null });

interface UploadModalProps extends UploadModalContextType {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function UploadModal({ open, onClose, children, selectFile, selectImage }: UploadModalProps) {
  let preview: React.ReactNode = null;
  let sourceInput: React.ReactNode = null;
  let filePicker: React.ReactNode = null;
  let saveButton: React.ReactNode = null;
  let deleteButton: React.ReactNode = null;
  let closeButton: React.ReactNode = null;
  let deleteImageButton: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === UploadModal.ImagePreview) {
      preview = child;
    } else if (child.type === UploadModal.SourceInput) {
      sourceInput = child;
    } else if (child.type === UploadModal.FilePicker) {
      filePicker = child;
    } else if (child.type === UploadModal.SaveButton) {
      saveButton = child;
    } else if (child.type === UploadModal.DeleteButton) {
      deleteButton = child;
    } else if (child.type === UploadModal.CloseButton) {
      closeButton = child;
    } else if (child.type === UploadModal.DeleteImage) {
      deleteImageButton = child;
    }
  });

  return (
    <UploadModalContext.Provider value={{ selectFile, selectImage }}>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            width: '90%',
            maxWidth: 400,
            maxHeight: '90vh',
            overflow: 'auto',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {preview}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {deleteImageButton}
            {filePicker}
          </Box>
          {sourceInput}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {saveButton}
            {deleteButton}
            {closeButton}
          </Box>
        </Box>
      </Modal>
    </UploadModalContext.Provider>
  );
}

UploadModal.ImagePreview = function ImagePreview() {
  const { selectImage, selectFile } = useContext(UploadModalContext);

  const src = selectImage ? selectImage.url : selectFile ? URL.createObjectURL(selectFile) : null;

  if (!src) {
    return null;
  }

  return (
    <Box
      component="img"
      src={src}
      alt="미리보기"
      sx={{ width: '100%', height: 200, objectFit: 'contain', borderRadius: 1, bgcolor: '#f5f5f5' }}
    />
  );
};

UploadModal.SourceInput = function SourceInput({ onChangeValue }: { onChangeValue: (value: string) => void }) {
  const { selectImage } = useContext(UploadModalContext);

  const [value, setValue] = useState(selectImage?.source || '');

  useEffect(() => {
    setValue(selectImage?.source || '');
  }, [selectImage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChangeValue(e.target.value);
  };

  return (
    <TextField label="출처" fullWidth value={value} onChange={handleChange} placeholder="예: 인스타그램 @seoulcrag" />
  );
};

UploadModal.FilePicker = function FilePicker({ onPick, file }: { onPick: (file: File) => void; file?: File | null }) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    onPick(files[0]);

    inputRef.current!.value = '';
  };

  return (
    <>
      <Button fullWidth variant="outlined" onClick={handleClick}>
        {`${file ? '다른 ' : ''}이미지 선택`}
      </Button>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
    </>
  );
};

UploadModal.DeleteImage = function DeleteImage({ onClick }: { onClick: () => void }) {
  const { selectFile } = useContext(UploadModalContext);

  if (!selectFile) {
    return;
  }

  return (
    <Button fullWidth variant="outlined" color="error" onClick={onClick}>
      이미지 삭제
    </Button>
  );
};

UploadModal.SaveButton = function SaveButton({ onClick }: { onClick: () => void }) {
  const { selectImage } = useContext(UploadModalContext);

  return (
    <Button fullWidth variant="contained" onClick={onClick}>
      {selectImage ? '수정' : '저장'}
    </Button>
  );
};

UploadModal.DeleteButton = function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <Button fullWidth variant="outlined" color="error" onClick={onClick}>
      삭제
    </Button>
  );
};

UploadModal.CloseButton = function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <Button fullWidth variant="outlined" onClick={onClick}>
      닫기
    </Button>
  );
};
