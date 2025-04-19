import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: `'Noto Sans KR', sans-serif`,
  },
  shape: {
    borderRadius: 8,
  },
});
