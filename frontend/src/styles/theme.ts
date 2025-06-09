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
    updateToast: 100000,

    sidebar: 10002,
    manageCragsSidebar: 10003,
    manageMenuSidebar: 10004,

    searchModal: 1003,
    filterSheet: 1004,

    mapControlBar: 100,
    mapControlFooter: 101,
  },
});

declare module '@mui/material/styles' {
  interface ZIndex {
    updateToast: number;

    sidebar: number;
    manageMenuSidebar: number;
    manageCragsSidebar: number;

    searchModal: number;
    filterSheet: number;

    mapControlBar: number;
    mapControlFooter: number;
  }
}
