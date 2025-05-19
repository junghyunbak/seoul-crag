import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Box, styled, Typography, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface InputFilterChipProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isSelect: boolean;
  emoji: string;
  onDelete?: () => void;
}

export const InputFilterChip = React.forwardRef<HTMLInputElement, InputFilterChipProps>(
  ({ value, onClick, isSelect, emoji, onDelete, ...rest }, ref) => {
    const theme = useTheme();

    return (
      <Box
        className=""
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          cursor: 'pointer',
          width: 'fit-content',
          py: 1,
          px: 1.5,
          borderRadius: 3,
          background: isSelect ? theme.palette.primary.light : theme.palette.common.white,
          boxShadow: 1,
        }}
        onClick={onClick}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            width: 21,
            height: 21,

            fontSize: '1rem',
          }}
        >
          {emoji}
        </Box>

        <Typography fontSize={'1rem'} color={isSelect ? 'white' : theme.palette.text.primary}>
          {value}
        </Typography>

        {isSelect && (
          <DeleteIcon
            sx={{
              color: isSelect ? 'white' : 'text.secondary',
            }}
            onClick={(e) => {
              e.stopPropagation();

              onDelete?.();
            }}
          />
        )}

        <input
          ref={ref}
          value={value}
          readOnly
          style={{
            position: 'absolute',
            opacity: 0,
            width: '100%',
            pointerEvents: 'none',
          }}
          {...rest}
        />
      </Box>
    );
  }
);

const ChipContext = createContext<{ buttonRef: React.RefObject<HTMLDivElement | null> }>({
  buttonRef: { current: null },
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

  background: isSelect ? theme.palette.primary.light : theme.palette.common.white,

  boxShadow: theme.shadows[1],
}));

const ChipLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isSelect',
})<{ isSelect: boolean }>(({ isSelect, theme }) => ({
  fontSize: theme.typography.body1.fontSize,
  color: isSelect ? 'white' : theme.palette.text.primary,
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

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === Chip.Icon) {
      icon = child;
    } else if (child.type === Chip.SubMenu) {
      subMenu = child;
    }
  });

  return (
    <ChipContext.Provider value={{ buttonRef }}>
      <ChipLayout>
        <ChipContent onClick={onClick} isSelect={isSelect} ref={buttonRef}>
          {icon}
          <ChipLabel isSelect={isSelect}>{label}</ChipLabel>
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
        <ChipLabel isSelect={isSelect}>{label}</ChipLabel>
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
