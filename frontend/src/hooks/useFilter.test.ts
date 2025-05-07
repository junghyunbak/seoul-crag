import { useFilter } from './useFilter';
import { renderHook } from '@testing-library/react';

describe('이미지 타입 존재여부 검사', () => {
  const mockCrag: Crag = {
    id: '',
    name: '',
    short_name: null,
    description: '',
    latitude: 0,
    longitude: 0,
    website_url: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  it('shower 타입의 이미지가 존재할 경우 hasShower가 true여야 한다.', () => {
    const { result } = renderHook(() => {
      const { hasShower } = useFilter({ ...mockCrag, imageTypes: ['shower'] });

      return { hasShower };
    });

    expect(result.current.hasShower).toBe(true);
  });

  it('shower 타입의 이미지가 존재하지 않을 경우 hasShower가 false여야 한다.', () => {
    const { result } = renderHook(() => {
      const { hasShower } = useFilter({ ...mockCrag, imageTypes: [] });

      return { hasShower };
    });

    expect(result.current.hasShower).toBe(false);
  });
});
