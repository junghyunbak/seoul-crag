import { useEffect, useState } from 'react';

import { useFetchCrags } from '@/hooks';

import { Box, Typography } from '@mui/material';

import { CragForm } from '@/pages/manage/Crags/CragForm';

import { cragsContext } from '@/pages/manage/Crags/index.context';

export function Crags() {
  const { crags } = useFetchCrags();

  const [expandedList, setExpandedList] = useState<boolean[]>([]);

  useEffect(() => {
    if (!crags) {
      return;
    }

    setExpandedList(Array(crags.length).fill(false));
  }, [crags]);

  if (!crags) {
    return null;
  }

  return (
    <cragsContext.Provider
      value={{
        crags,
      }}
    >
      <Box>
        <Typography variant="h3">내 암장 관리</Typography>

        {crags
          /**
           * 정렬 기준이 변경되면 순서가 달라져서 고정 필요
           */
          .sort((a, b) => (a.id < b.id ? -1 : 1))
          .map((crag, i) => {
            return (
              <CragForm
                expanded={expandedList[i] || false}
                onChange={(isOpen) =>
                  setExpandedList((prev) => {
                    return prev.map((_, idx) => (idx === i ? isOpen : false));
                  })
                }
                key={crag.id}
                initialCrag={crag}
              />
            );
          })}
      </Box>
    </cragsContext.Provider>
  );
}
