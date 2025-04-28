import { useState } from 'react';

import { useFetchCrag } from '@/hooks';

import { Box } from '@mui/material';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';
import { CragPositionField } from '@/pages/manage/Crags/CragForm/CragPositionField';
import { CragScheduleCalenderField } from '@/pages/manage/Crags/CragForm/CragScheduleCalenderField';
import { CragNameField } from '@/pages/manage/Crags/CragForm/CragNameField';
import { CragImagesField } from '@/pages/manage/Crags/CragForm/CragImagesField';
import { CragAreaField } from '@/pages/manage/Crags/CragForm/CragAreaField';
import { CragOpeningHoursField } from '@/pages/manage/Crags/CragForm/CragOpeningHoursField';
import { CragDescriptionField } from '@/pages/manage/Crags/CragForm/CragDescriptionField';
import { CragWebsiteUrlField } from '@/pages/manage/Crags/CragForm/CragWebsiteUrlField';
import { CragThumbnailField } from '@/pages/manage/Crags/CragForm/CragThumbnailField';

interface CragFormProps {
  initialCrag: Crag;
}

export function CragForm({ initialCrag }: CragFormProps) {
  const [queryEnabled, setQueryEnabled] = useState(false);

  const { crag, refetch } = useFetchCrag({
    cragId: initialCrag.id,
    enabled: queryEnabled,
    initialData: initialCrag,
  });

  if (!crag) {
    return;
  }

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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              width: { md: '400px', xs: '100%' },
              aspectRatio: '1/1',
            }}
          >
            <CragPositionField />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflow: 'hidden' }}>
            <CragNameField />
            <CragAreaField />
            <CragImagesField imageType="interior" />
          </Box>
        </Box>
        <CragThumbnailField />
        <CragDescriptionField />
        <CragWebsiteUrlField />
        <CragImagesField imageType="shower" />
        <CragOpeningHoursField />
        <CragScheduleCalenderField />
      </Box>
    </cragFormContext.Provider>
  );
}
