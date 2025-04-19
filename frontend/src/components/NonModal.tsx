import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { Paper } from '@mui/material';

import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react';

interface NonModalProps extends React.PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  referenceRef: React.RefObject<HTMLDivElement | null>;
}

export function NonModal({ isOpen, referenceRef, onClose, children }: NonModalProps) {
  const { refs, floatingStyles, update } = useFloating({
    middleware: [offset(4), flip(), shift()],
    placement: 'bottom-start',
  });

  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * 위치 설정
   */
  useEffect(() => {
    refs.setReference(referenceRef.current);
  }, [referenceRef, refs]);

  /**
   * 위치 자동 업데이트
   */
  useEffect(() => {
    if (!referenceRef.current || !refs.floating.current) {
      return;
    }

    const cleanup = autoUpdate(referenceRef.current, refs.floating.current, update);

    return cleanup;
  }, [referenceRef, refs.floating, update, isOpen]);

  /**
   * 바깥클릭 시 닫기
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        referenceRef.current &&
        !referenceRef.current.contains(target)
      ) {
        onClose(); // 외부 클릭 시 닫기
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return function cleanup() {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, referenceRef]);

  if (!isOpen) {
    return;
  }

  return createPortal(
    <Paper
      ref={(el) => {
        refs.setFloating(el);
        contentRef.current = el;
      }}
      style={floatingStyles}
    >
      {children}
    </Paper>,
    document.body
  );
}
