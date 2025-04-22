import { useState } from 'react';

import { useFetchCrag } from '@/hooks';

import { Box, Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';
import { CragPositionField } from '@/pages/manage/Crags/CragForm/CragPositionField';
import { CragScheduleCalenderField } from '@/pages/manage/Crags/CragForm/CragScheduleCalenderField';
import { CragNameField } from '@/pages/manage/Crags/CragForm/CragNameField';
import { CragImagesField } from '@/pages/manage/Crags/CragForm/CragImagesField';
import { CragAreaField } from '@/pages/manage/Crags/CragForm/CragAreaField';
import { StringParam, useQueryParam } from 'use-query-params';
import { QUERY_STRING } from '@/constants';

interface CragFormProps {
  initialCrag: Crag;
  expanded: boolean;
  onChange: (isOpen: boolean) => void;
}

export function CragForm({ initialCrag, expanded, onChange }: CragFormProps) {
  const [queryEnabled, setQueryEnabled] = useState(false);

  const [, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

  const { crag, refetch } = useFetchCrag({
    cragId: initialCrag.id,
    enabled: queryEnabled,
    initialData: initialCrag,
  });

  return (
    <cragFormContext.Provider
      value={{
        crag,
        revalidateCrag: () => {
          if (!queryEnabled) {
            setQueryEnabled(true);
          }

          refetch();
        },
      }}
    >
      <Accordion
        key={crag.id}
        expanded={expanded}
        onChange={(_, isOpen) => {
          if (isOpen) {
            setSelectCragId(crag.id);
          }

          onChange(isOpen);
        }}
      >
        <AccordionSummary>{crag.name}</AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  width: { md: '400px', xs: '100%' },
                  aspectRatio: '1/1',
                }}
              >
                {expanded && <CragPositionField />}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflow: 'hidden' }}>
                <CragNameField />
                <CragAreaField />
                <CragImagesField imageType="interior" />
              </Box>
            </Box>

            <CragScheduleCalenderField />
          </Box>
        </AccordionDetails>
      </Accordion>
    </cragFormContext.Provider>
  );
}
