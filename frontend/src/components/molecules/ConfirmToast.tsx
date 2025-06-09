import { useConfirm, useModifyConfirm } from '@/hooks';

import { AnimatePresence, motion } from 'framer-motion';

import { Paper, Box, Typography, Button, IconButton, useTheme } from '@mui/material';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import CloseIcon from '@mui/icons-material/Close';

export function ConfirmToast() {
  const { confirmContext } = useConfirm();

  const { closeConfirm } = useModifyConfirm();

  const theme = useTheme();

  return (
    <AnimatePresence>
      {confirmContext && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.updateToast,
          }}
        >
          <Box
            sx={{
              p: 2,
            }}
          >
            <Paper
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                pb: 1,
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <InfoOutlineIcon color="primary" />
                <Typography>{confirmContext.message}</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                <Button
                  variant="text"
                  onClick={() => {
                    confirmContext.callback();
                    closeConfirm();
                  }}
                >
                  확인
                </Button>

                <IconButton
                  onClick={() => {
                    closeConfirm();
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Paper>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
