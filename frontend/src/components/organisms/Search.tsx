import { useEffect, useRef, useState } from 'react';

import { Box, Divider, Grow, Modal, CircularProgress } from '@mui/material';

import { useCrag, useModifySearch, useSearch } from '@/hooks';

import { Atoms } from '@/components/atoms';
import { Molecules } from '@/components/molecules';
import { SortOptionSelector } from '@/components/molecules/SortOptionSelector';

export function Search() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { searchKeyword, isSearchOpen } = useSearch();

  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState(searchKeyword);

  const { crags } = useCrag();

  const { updateIsSearchOpen, updateSearchKeyword } = useModifySearch();

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsLoading(true);

    timerRef.current = setTimeout(() => {
      updateSearchKeyword(keyword);
      setIsLoading(false);
    }, 500);
  }, [keyword, updateSearchKeyword]);

  const handleClose = () => {
    updateIsSearchOpen(false);
  };

  return (
    <Modal
      open={isSearchOpen}
      onClose={handleClose}
      slots={{ backdrop: () => null }}
      sx={(theme) => ({ zIndex: theme.zIndex.searchModal })}
    >
      <Grow in={isSearchOpen}>
        <Box
          sx={(theme) => ({
            background: theme.palette.common.white,
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
          })}
          tabIndex={-1}
        >
          {/**
           * - modal 닫기 버튼
           * - 검색 input
           */}
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Atoms.Button.Back onClick={handleClose} />
            <Box sx={{ flex: 1 }}>
              <Molecules.SearchInputWithRemove
                value={keyword}
                onChange={(value) => setKeyword(value)}
                onRemove={() => setKeyword('')}
                placeholder="클라이밍장 검색"
              />
            </Box>
          </Box>

          {/**
           * 필터
           */}
          <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
            <Molecules.FilterTrigger />
            <Molecules.ExpeditionDate />
          </Box>

          {/**
           * 정렬 옵션
           */}
          <Box sx={{ p: 2 }}>
            <SortOptionSelector />
          </Box>

          {/**
           * 검색 개수
           */}
          <Box sx={{ p: 2, pt: 0 }}>
            <Atoms.Text.Body variant="body2">{`${crags.length}개의 검색 결과`}</Atoms.Text.Body>
          </Box>

          <Divider />

          {/**
           * 암장 리스트
           */}
          {isLoading ? (
            <Box sx={{ p: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Molecules.CragList />
          )}
        </Box>
      </Grow>
    </Modal>
  );
}
