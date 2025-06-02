import { useSearch } from '@/hooks';

import { Atoms } from '@/components/atoms';

export function FakeSearhInput() {
  const { searchKeyword } = useSearch();

  if (searchKeyword) {
    <Atoms.Text.Title
      sx={{
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      }}
    >
      {searchKeyword}
    </Atoms.Text.Title>;
  }

  return (
    <Atoms.Text.Body
      sx={{
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      }}
    >
      클라이밍장 검색
    </Atoms.Text.Body>
  );
}
