import { StringParam, useQueryParam } from 'use-query-params';

import { useFetchCrags } from '@/hooks';

import { Box, FormControl, InputLabel, Select, MenuItem as SelectMenuItem } from '@mui/material';

import { CragForm } from '@/pages/manage/Crags/CragForm';

import { QUERY_STRING } from '@/constants';

import { cragsContext } from '@/pages/manage/Crags/index.context';
import { MenuItem, Sidebar, Menu } from 'react-pro-sidebar';

export function Crags() {
  const { crags } = useFetchCrags();

  const [selectCragId, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

  const crag = crags?.find((crag) => crag.id === selectCragId);

  if (!crags) {
    return null;
  }

  return (
    <cragsContext.Provider
      value={{
        crags,
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          height: '100%',
        }}
      >
        <Sidebar breakPoint="xl" style={{ height: '100%' }} backgroundColor="white">
          <Menu
            menuItemStyles={{
              button: ({ level, active }) => {
                // only apply styles on first level elements of the tree
                if (level === 0)
                  return {
                    color: '#b6c8d9',
                    backgroundColor: active ? '#13395e' : undefined,

                    '&:hover': {
                      backgroundColor: '#13395e',
                    },
                  };
              },
            }}
          >
            {crags.map((crag) => (
              <MenuItem
                key={crag.id}
                onClick={() => {
                  if (selectCragId !== crag.id) {
                    setSelectCragId(crag.id);
                  } else {
                    setSelectCragId(null);
                  }
                }}
                active={selectCragId === crag.id}
              >
                {crag.name}
              </MenuItem>
            ))}
          </Menu>
        </Sidebar>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'auto', overflowY: 'scroll' }}>
        <Box
          sx={{
            p: 2,
            pb: 0,
            display: {
              lg: 'none',
            },
          }}
        >
          <FormControl fullWidth>
            <InputLabel>암장 선택</InputLabel>
            <Select
              value={selectCragId || ''}
              onChange={(e) => {
                setSelectCragId(e.target.value);
              }}
            >
              <SelectMenuItem value="">None</SelectMenuItem>
              {crags &&
                crags.map(({ id, name }) => {
                  return (
                    <SelectMenuItem value={id} key={id}>
                      {name}
                    </SelectMenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Box>

        {crag && <CragForm initialCrag={crag} />}
      </Box>
    </cragsContext.Provider>
  );
}
