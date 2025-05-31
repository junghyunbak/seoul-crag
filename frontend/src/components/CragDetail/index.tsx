import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { Box, Divider } from '@mui/material';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { useFetchCrag, useFetchImages } from '@/hooks';

import { AnimatePresence, motion } from 'framer-motion';

import { zIndex } from '@/styles';

import { CragDetailHero } from '@/components/CragDetail/CragDetailHero';
import { CragDetailOpeningHours } from '@/components/CragDetail/CragDetailOpeningHours';
import { CragDetailShareButton } from '@/components/CragDetail/CragDetailShareButton';
import { CragDetailEditButton } from '@/components/CragDetail/CragDetailEditButton';
import { CragDetailWebsiteUrl } from '@/components/CragDetail/CragDetailWebsiteUrl';
import { CragDetailLocation } from '@/components/CragDetail/CragDetailLocation';
import { CragDetailComment } from '@/components/CragDetail/CragDetailComment';
import { CragDetailTopbar } from '@/components/CragDetail/CragDetailTopbar';
import { CragDetailSentinel } from '@/components/CragDetail/CragDetailSentinel';

import { CragDetailContext } from '@/components/CragDetail/index.context';
import { CragDetailTitle } from '@/components/CragDetail/CragDetailTitle';
import { CragDetailDescription } from '@/components/CragDetail/CragDetailDescription';
import { CragDetailFooter } from '@/components/CragDetail/CragDetailFooter';
import { CragDetailCalendar } from '@/components/CragDetail/CragDetailCalendar';
import { CragDetailTags } from '@/components/CragDetail/CragDetailTags';
import { CragDetailContribution } from './CragDetailContribution';
import { CragDetailArea } from '@/components/CragDetail/CragDetailArea';

export default function CragDetail() {
  const [selectCragDetailId, setSelectCragDetailId] = useQueryParam(QUERY_STRING.SELECT_CRAGE_DETAIL, StringParam);

  const { crag } = useFetchCrag({ cragId: selectCragDetailId });
  const { images } = useFetchImages(selectCragDetailId, 'interior');

  return createPortal(
    <AnimatePresence>
      {typeof selectCragDetailId === 'string' && (
        <CragDetailContext.Provider value={{ crag, images, onClose: () => setSelectCragDetailId(null) }}>
          <CragDetailContent />
        </CragDetailContext.Provider>
      )}
    </AnimatePresence>,
    document.body
  );
}

function CragDetailContent() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  /**
   * 상단바 스타일 조정을 위한 observer 등록
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolledPastHero(!entry.isIntersecting);
      },
      {
        root: scrollContainerRef.current,
        threshold: 0,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: zIndex.cragDetail,
        background: 'white',
      }}
      ref={scrollContainerRef}
    >
      <CragDetailTopbar isScrolled={scrolledPastHero} />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflowY: 'scroll',
          position: 'relative',
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <CragDetailHero />
        <CragDetailSentinel ref={sentinelRef} />
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <CragDetailTitle />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <CragDetailShareButton />
              <CragDetailEditButton />
            </Box>
          </Box>
          <CragDetailArea />
          <CragDetailTags />
          <CragDetailDescription />
          <CragDetailWebsiteUrl />
          <Divider />
          <CragDetailOpeningHours />
          <Divider />
          <CragDetailCalendar />
          <Divider />
          <CragDetailLocation />
          <Divider />
          <CragDetailComment />
          <Divider />
          <CragDetailContribution />
        </Box>
        <CragDetailFooter />
      </Box>
    </motion.div>
  );
}
