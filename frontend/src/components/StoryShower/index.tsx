import { Box, Typography } from '@mui/material';
import { StorySlider } from '@/components/StorySlider';
import { AnimatePresence } from 'framer-motion';
import { useQueryParam, StringParam } from 'use-query-params';
import { QUERY_STRING } from '@/constants';
import { createPortal } from 'react-dom';
import { useFetchCrag, useFilter } from '@/hooks';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { ImageWithSource } from '@/components/ImageWithSource';

export default function StoryShower() {
  const [showerCragId, setShowerCragId] = useQueryParam(QUERY_STRING.STORY_SHOWER, StringParam);

  const { crag } = useFetchCrag({ cragId: showerCragId });

  const { showerImages } = useFilter(crag || undefined);

  const storyContents = (() => {
    const contents: React.ReactNode[] = [];

    if (!crag) {
      return contents;
    }

    if (crag.shower_url) {
      contents.push(<ShowerContentTypeLink imageSrcUrl={crag.shower_url} />);
    }

    showerImages.forEach((image) => {
      contents.push(<ShowerContentTypeImage image={image} />);
    });

    return contents;
  })();

  return createPortal(
    <AnimatePresence>
      {showerCragId && crag && typeof crag.shower_url === 'string' && (
        <StorySlider
          crag={crag}
          contents={storyContents}
          onClose={() => setShowerCragId(null)}
          onComplete={() => setShowerCragId(null)}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}

interface ShowerContentTypeLinkProps {
  imageSrcUrl: string;
}

function ShowerContentTypeLink({ imageSrcUrl }: ShowerContentTypeLinkProps) {
  return (
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
          window.open(imageSrcUrl, '_blank');
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
    </Box>
  );
}

interface ShowerContentTypeImageProps {
  image: Image;
}

function ShowerContentTypeImage({ image }: ShowerContentTypeImageProps) {
  const { source } = image;

  return (
    <Box>
      <ImageWithSource image={image} />

      {source && (
        <Box
          sx={{
            display: 'flex',
            p: 1,
            background: 'white',
            alignItems: 'center',
            borderRadius: 0.5,
            cursor: 'pointer',
            pointerEvents: 'auto',
            position: 'absolute',
            left: '50%',
            bottom: '10%',
            transform: 'translateX(-50%)',
            color: '#04c139',
          }}
          onClick={() => {
            window.open(source, '_blank');
          }}
        >
          <InsertLinkIcon
            fontSize="large"
            sx={{
              transform: 'rotate(-45deg)',
              fill: 'currentColor',
            }}
          />
          <Typography variant="h4" sx={{ lineHeight: 1, color: 'currentcolor', letterSpacing: -1 }}>
            BLOG LINK
          </Typography>
        </Box>
      )}
    </Box>
  );
}
