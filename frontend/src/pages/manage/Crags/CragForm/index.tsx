import { useState } from 'react';

import { useFetchCrag } from '@/hooks';

import { Box, Divider, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
import { CragOpenedAtField } from '@/pages/manage/Crags/CragForm/CragOpenedAtField';
import { CragShortNameField } from '@/pages/manage/Crags/CragForm/CragShortNameField';
import { CragShowerUrlField } from '@/pages/manage/Crags/CragForm/CragShowerUrlField';
import { CragOuterWallField } from '@/pages/manage/Crags/CragForm/CragOuterWallField';
import { CragTagsField } from '@/pages/manage/Crags/CragForm/CragTagsField';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';
import { CragContributesField } from './CragContributesField';

interface CragFormProps {
  initialCrag: Crag;
}

export function CragForm({ initialCrag }: CragFormProps) {
  const [queryEnabled, setQueryEnabled] = useState(false);

  const [, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
            <IconButton
              onClick={() => {
                setSelectCragId(null);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4">{crag.name}</Typography>
          </Box>
          <Divider />
        </Box>

        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 8, md: 8 }}>
                    <CragNameField />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <CragShortNameField />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                    <CragWebsiteUrlField />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                    <CragShowerUrlField />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <CragAreaField />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <CragDescriptionField />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <CragTagsField />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <CragOuterWallField />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <CragOpenedAtField />
                  </Grid>

                  <Grid size={{ xs: 12, md: 8 }}>
                    <CragImagesField imageType="interior" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <CragThumbnailField />
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <CragPositionField />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <CragOpeningHoursField />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <CragScheduleCalenderField />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <CragContributesField />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </cragFormContext.Provider>
  );
}
