import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import { cragFormContext } from '@/components/organisms/CragForm/index.context';
import { CragPositionField } from '@/components/organisms/CragForm/CragPositionField';
import { CragScheduleCalenderField } from '@/components/organisms/CragForm/CragScheduleCalenderField';
import { CragNameField } from '@/components/organisms/CragForm/CragNameField';
import { CragImagesField } from '@/components/organisms/CragForm/CragImagesField';
import { CragAreaField } from '@/components/organisms/CragForm/CragAreaField';
import { CragOpeningHoursField } from '@/components/organisms/CragForm/CragOpeningHoursField';
import { CragDescriptionField } from '@/components/organisms/CragForm/CragDescriptionField';
import { CragWebsiteUrlField } from '@/components/organisms/CragForm/CragWebsiteUrlField';
import { CragThumbnailField } from '@/components/organisms/CragForm/CragThumbnailField';
import { CragOpenedAtField } from '@/components/organisms/CragForm/CragOpenedAtField';
import { CragShortNameField } from '@/components/organisms/CragForm/CragShortNameField';
import { CragShowerUrlField } from '@/components/organisms/CragForm/CragShowerUrlField';
import { CragOuterWallField } from '@/components/organisms/CragForm/CragOuterWallField';
import { CragTagsField } from '@/components/organisms/CragForm/CragTagsField';
import { CragContributesField } from './CragContributesField';
import { CragFeedField } from './CragFeedField';
import { CragPriceField } from '@/components/organisms/CragForm/CragPriceField';
import { CragDiscountsField } from '@/components/organisms/CragForm/CragDiscountsField';

interface CragFormProps {
  crag: Crag;
  revalidateCrag: () => void;
}

export function CragForm({ crag, revalidateCrag }: CragFormProps) {
  return (
    <cragFormContext.Provider
      value={{
        crag,
        revalidateCrag,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            {crag.name}
          </Typography>
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

                  <Grid size={{ xs: 12 }}>
                    <CragPriceField />
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
                    <CragImagesField imageType="shower" />
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
              <Grid size={{ xs: 12, md: 6 }}>
                <CragContributesField />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <CragDiscountsField />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <CragFeedField />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </cragFormContext.Provider>
  );
}
