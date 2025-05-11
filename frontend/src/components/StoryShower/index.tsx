import { Box, Typography } from '@mui/material';
import { StorySlider } from '@/components/StorySlider';
import { AnimatePresence } from 'framer-motion';
import { useQueryParam, StringParam } from 'use-query-params';
import { QUERY_STRING } from '@/constants';
import { createPortal } from 'react-dom';
import { useFetchCrag } from '@/hooks';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

export default function StoryShower() {
  const [showerCragId, setShowerCragId] = useQueryParam(QUERY_STRING.STORY_SHOWER, StringParam);

  const { crag } = useFetchCrag({ cragId: showerCragId });

  return createPortal(
    <AnimatePresence>
      {showerCragId && crag && crag.shower_url !== '' && (
        <StorySlider
          crag={crag}
          contents={[
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
                /**
                 * 클릭 가능해야하므로 필수
                 */
                position: 'absolute',
              }}
            >
              <Typography variant="h2" color="white">
                샤워실 정보
              </Typography>
              <Typography variant="h3" color="white">
                ↘️⬇️↙️
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  p: 1,
                  background: 'white',
                  alignItems: 'center',
                  borderRadius: 1,
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                }}
                onClick={() => {
                  window.open(crag.shower_url, '_blank');
                }}
              >
                <InsertLinkIcon
                  fontSize="large"
                  sx={{
                    transform: 'rotate(-45deg)',
                  }}
                />
                <Typography variant="h3">BLOG LINK</Typography>
              </Box>
              ,
            </Box>,
          ]}
          onClose={() => setShowerCragId(null)}
          onComplete={() => setShowerCragId(null)}
          initPaused
        />
      )}
    </AnimatePresence>,
    document.body
  );
}
