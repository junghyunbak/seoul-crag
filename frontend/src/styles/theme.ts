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
  zIndex: {
    sidebar: 10002,

    searchModal: 1003,
    filterSheet: 1004,

    mapControlBar: 100,
    mapControlFooter: 101,
  },
});

declare module '@mui/material/styles' {
  interface ZIndex {
    sidebar: number;

    searchModal: number;
    filterSheet: number;

    mapControlBar: number;
    mapControlFooter: number;
  }
}
