import { Box, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { AnimatePresence, motion } from 'framer-motion';

export function SearchAndLoading({ isLoading }: { isLoading: boolean }) {
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="A"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              inset: 0,
            }}
          >
            <CircularProgress size={'100%'} sx={(theme) => ({ color: theme.palette.grey[600] })} />
          </motion.div>
        ) : (
          <motion.div
            key="B"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              inset: 0,
            }}
          >
            <SearchIcon sx={(theme) => ({ width: '100%', height: '100%', color: theme.palette.grey[600] })} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
