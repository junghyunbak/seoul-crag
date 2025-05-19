import React, { createContext, useContext, useEffect, useRef } from 'react';

import { Box, styled, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type ChipContextType = {
  buttonRef: React.RefObject<HTMLDivElement | null>;
  isSelect: boolean;
};

const ChipContext = createContext<ChipContextType>({
  buttonRef: { current: null },
  isSelect: false,
});

const ChipLayout = styled(Box)(() => ({
  position: 'relative',
}));

const ChipContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelect',
})<{ isSelect: boolean }>(({ isSelect, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),

  cursor: 'pointer',

  width: 'fit-content',
  padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,

  borderRadius: theme.shape.borderRadius * 3,

  background: isSelect ? theme.palette.grey['200'] : theme.palette.common.white,

  border: `1px solid ${!isSelect ? theme.palette.grey['300'] : theme.palette.grey['200']}`,

  boxShadow: theme.shadows[1],
}));

const ChipLabel = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.body1.fontSize,
  color: theme.palette.common.black,
}));

interface ChipProps extends React.PropsWithChildren {
  label: string;
  isSelect: boolean;
  onClick: () => void;
}

export function Chip({ label, isSelect, onClick, children }: ChipProps) {
  const buttonRef = useRef<HTMLDivElement | null>(null);

  let icon: React.ReactNode = null;
  let subMenu: React.ReactNode = null;
  let deleteButton: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === Chip.Icon) {
      icon = child;
    } else if (child.type === Chip.SubMenu) {
      subMenu = child;
    } else if (child.type === Chip.DeleteButton) {
      deleteButton = child;
    }
  });

  return (
    <ChipContext.Provider value={{ buttonRef, isSelect }}>
      <ChipLayout>
        <ChipContent onClick={onClick} isSelect={isSelect} ref={buttonRef}>
          {icon}
          <ChipLabel>{label}</ChipLabel>
          {deleteButton}
        </ChipContent>

        {subMenu}
      </ChipLayout>
    </ChipContext.Provider>
  );
}

interface SubMenuProps extends React.PropsWithChildren {
  onClickOutOfMenu?: () => void;
}

Chip.SubMenu = function SubMenu({ children, onClickOutOfMenu }: SubMenuProps) {
  const { buttonRef } = useContext(ChipContext);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clickListener = (e: MouseEvent) => {
      if (isParentExist(e.target, menuRef.current, buttonRef.current)) {
        return;
      }

      onClickOutOfMenu?.();
    };

    window.addEventListener('click', clickListener);

    return function cleanup() {
      window.removeEventListener('click', clickListener);
    };
  }, [buttonRef, onClickOutOfMenu]);

  const subChips: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === Chip.SubChip) {
      subChips.push(child);
    }
  });
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        marginTop: 1,
      }}
      ref={menuRef}
    >
      {subChips}
    </Box>
  );
};

interface SubChipProps extends ChipProps {}

Chip.SubChip = function SubChip({ isSelect, onClick, label }: SubChipProps) {
  return (
    <ChipLayout>
      <ChipContent isSelect={isSelect} onClick={onClick}>
        <ChipLabel>{label}</ChipLabel>
      </ChipContent>
    </ChipLayout>
  );
};

Chip.Icon = function Icon({ children }: React.PropsWithChildren) {
  return (
    <Box
      sx={{
        width: '20px',
        aspectRatio: '1/1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </Box>
  );
};

interface DeleteButtonProps {
  onDelete: () => void;
}

Chip.DeleteButton = function DeleteButton({ onDelete }: DeleteButtonProps) {
  const { isSelect } = useContext(ChipContext);

  if (!isSelect) {
    return null;
  }

  return (
    <CloseIcon
      sx={(theme) => ({
        borderRadius: '50%',
        background: theme.palette.grey[400],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
        p: '3px',
        ml: '2px',
        mr: '-4px',
        color: theme.palette.common.white,
      })}
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
    />
  );
};

type PossibleElement = HTMLElement | SVGElement | EventTarget | null;

export function isParentExist(child: PossibleElement, ...parents: PossibleElement[]): boolean {
  if ([child, ...parents].some((el) => !el)) {
    return false;
  }

  let el: PossibleElement = child;

  while (el instanceof HTMLElement || el instanceof SVGElement) {
    if (parents.some((parent) => parent === el)) {
      return true;
    }

    el = el.parentElement;
  }

  return false;
}
