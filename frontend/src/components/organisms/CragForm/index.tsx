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
import { CragShutDownField } from '@/components/organisms/CragForm/CragShutDownField';
import { Molecules } from '@/components/molecules';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

interface CragFormProps {
  crag: Crag;
  revalidateCrag: () => void;
}

export function CragForm({ crag, revalidateCrag }: CragFormProps) {
  const [setIsCragsSidebarOpen] = useStore(useShallow((s) => [s.setIsCragsSidebarOpen]));

  return (
    <cragFormContext.Provider
      value={{
        crag,
        revalidateCrag,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={(theme) => ({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            pb: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          })}
        >
          <Typography variant="h4">{crag.name}</Typography>
          {/**
           * // TODO: crags sidebar와 breakpoint가 완전히 일치하지 않는 이슈 수정
           */}
          <Box sx={{ display: { md: 'none' } }}>
            <Molecules.MenuTrigger
              onClick={() => {
                setIsCragsSidebarOpen(true);
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <CragPositionField />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CragFormDefaultInfo />
            </Grid>

            {/**
             * 암장 태그
             */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CragTagsField />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} />

            {/**
             * 암장 이미지
             */}
            <Grid size={{ xs: 12 }}>
              <CragImagesField imageType="interior" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CragImagesField imageType="shower" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CragThumbnailField />
            </Grid>

            {/**
             * 운영 시간
             */}
            <Grid size={{ xs: 12 }}>
              <CragOpeningHoursField />
            </Grid>

            {/**
             * 운영 일정
             */}
            <Grid size={{ xs: 12 }}>
              <CragScheduleCalenderField />
            </Grid>

            {/**
             * 할인 정보
             */}
            <Grid size={{ xs: 12 }}>
              <CragDiscountsField />
            </Grid>

            {/**
             * 기여 관리
             */}
            <Grid size={{ xs: 12 }}>
              <CragContributesField />
            </Grid>

            {/**
             * 피드
             */}
            <Grid size={{ xs: 12 }}>
              <CragFeedField />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </cragFormContext.Provider>
  );
}

function CragFormDefaultInfo() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">기본 정보</Typography>

      <Grid container spacing={2}>
        {/**
         * 암장 이름
         */}
        <Grid size={{ xs: 12, sm: 8, md: 8 }}>
          <CragNameField />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <CragShortNameField />
        </Grid>

        {/**
         * 링크
         */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CragWebsiteUrlField />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} />

        <Grid size={{ xs: 12, sm: 6 }}>
          <CragShowerUrlField />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} />

        {/**
         * 암장 소개
         */}
        <Grid size={{ xs: 12 }}>
          <CragDescriptionField />
        </Grid>

        {/**
         * 암장 크기
         */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <CragAreaField />
        </Grid>
        <Grid size={{ xs: 12, sm: 9 }} />

        {/**
         * 암장 가격
         */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <CragPriceField />
        </Grid>
        <Grid size={{ xs: 12, sm: 9 }} />

        {/**
         * 외벽 여부
         */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <CragOuterWallField />
        </Grid>
        <Grid size={{ xs: 12, sm: 9 }} />

        {/**
         * 폐업여부
         */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <CragShutDownField />
        </Grid>
        <Grid size={{ xs: 12, sm: 9 }} />

        {/**
         * 암장 오픈일
         */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <CragOpenedAtField />
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }} />
      </Grid>
    </Box>
  );
}
