import TuneIcon from '@mui/icons-material/Tune';

import { useExp, useFilter, useTag, useModifyFilterSheet } from '@/hooks';

import { Atoms } from '@/components/atoms';

export function FilterTrigger() {
  const { isExpSelect } = useExp();
  const { filter } = useFilter();
  const { selectTagId } = useTag();

  const { updateIsFilterBottomSheetOpen } = useModifyFilterSheet();

  const appliedFilterCount = (() => {
    let cnt = 0;

    cnt += Array.from(Object.values(filter)).reduce((a, c) => a + (typeof c === 'boolean' && c ? 1 : 0), 0);
    cnt += Array.from(Object.values(selectTagId)).reduce((a, c) => a + (typeof c === 'string' ? 1 : 0), 0);
    cnt += isExpSelect ? 1 : 0;

    return cnt;
  })();

  return (
    <Atoms.Badge.PaperBorder badgeContent={appliedFilterCount}>
      <TuneIcon
        onClick={() => {
          updateIsFilterBottomSheetOpen(true);
        }}
      />
    </Atoms.Badge.PaperBorder>
  );
}
