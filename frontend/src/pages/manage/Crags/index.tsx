import { useEffect } from 'react';

import { useFetchCrags, useModifyCrag } from '@/hooks';

import { Typography } from '@mui/material';

import { CragForm } from '@/pages/manage/Crags/CragForm';

export function Crags() {
  const { crags } = useFetchCrags();

  const { updateCragMap } = useModifyCrag();

  /**
   * // [ ]: 초기화 안해도 평균값 구할 수 있게 마커의 인터페이스로 넣기
   */
  useEffect(() => {
    if (!crags) {
      return;
    }

    updateCragMap(crags);
  }, [crags, updateCragMap]);

  if (!crags) {
    return null;
  }

  return (
    <div>
      <Typography variant="h3">내 암장 관리</Typography>

      {/**
       * 정렬 기준이 변경되면 순서가 달라져서 고정 필요
       *
       * // [ ]: 한번에 하나의 요소만 렌더링 하도록 구현
       */}
      {crags
        .sort((a, b) => (a.id < b.id ? -1 : 1))
        .slice(0, 3)
        .map((crag) => {
          return <CragForm key={crag.id} initialCrag={crag} />;
        })}
    </div>
  );
}
