import { Atoms } from '@/components/atoms';
import { useExp, useModifyFilterSheet } from '@/hooks';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function ExpeditionDate() {
  const { exp, isExpSelect } = useExp();

  const { updateIsFilterBottomSheetOpen } = useModifyFilterSheet();

  const formattedDate = format(exp.date, 'M월 dd일 (E) a h:mm', { locale: ko });

  const handleFilterSheetOpen = () => {
    updateIsFilterBottomSheetOpen(true);
  };

  if (isExpSelect) {
    return (
      <Atoms.Text.Title
        onClick={handleFilterSheetOpen}
        sx={{
          cursor: 'pointer',
        }}
      >
        <Atoms.Text.Highlight
          fontWeight={{
            fontWeight: 600,
          }}
        >
          {formattedDate}
        </Atoms.Text.Highlight>{' '}
        이용
      </Atoms.Text.Title>
    );
  }

  return <Atoms.Text.Title onClick={handleFilterSheetOpen}>{formattedDate} 이용</Atoms.Text.Title>;
}
