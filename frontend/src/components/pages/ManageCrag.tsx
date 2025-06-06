import { useParams } from 'react-router';

import { Organisms } from '@/components/organisms';

import { useFetchCrag } from '@/hooks';

export default function ManageCrag() {
  const { id } = useParams<{ id: string }>();

  const { crag, refetch } = useFetchCrag({
    cragId: id,
    feeds: true,
  });

  if (!crag) {
    return;
  }

  return (
    <Organisms.CragForm
      crag={crag}
      revalidateCrag={() => {
        refetch();
      }}
    />
  );
}
