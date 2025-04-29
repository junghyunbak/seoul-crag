import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { useQueryParam, BooleanParam } from 'use-query-params';
import { QUERY_STRING } from '@/constants';
import { format } from 'date-fns';
import { useCallback, useMemo } from 'react';

export function useFilter() {
  const [sheetRef] = useStore(useShallow((s) => [s.sheetRef]));
  const [isFilterSheetOpen] = useStore(useShallow((s) => [s.isFilterSheetOpen]));

  const [enableShowerFilter, setEnableShowerFilter] = useQueryParam(QUERY_STRING.FILTER_SHOWER, BooleanParam);
  const [enableExceptionSettingFilter, setEnableExceptionSettingFilter] = useQueryParam(
    QUERY_STRING.FILTER_EXCEPTION_SETTING,
    BooleanParam
  );
  const [enableNewSettingFilter, setEnableNewSettingFilter] = useQueryParam(
    QUERY_STRING.FILTER_NEW_SETTING,
    BooleanParam
  );

  const todayIso = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

  const showerFilter = useMemo(
    () =>
      enableShowerFilter
        ? (crag: Crag) => {
            return crag.imageTypes?.includes('shower') || false;
          }
        : () => {
            return true;
          },
    [enableShowerFilter]
  );

  const exceptionSettingFilter = useMemo(
    () =>
      enableExceptionSettingFilter
        ? (crag: Crag) => {
            return !(crag.futureSchedules || []).some(
              ({ type, date }) => type === 'setup' && format(date, 'yyyy-MM-dd') === todayIso
            );
          }
        : () => {
            return true;
          },
    [enableExceptionSettingFilter, todayIso]
  );

  const newSettingFilter = useMemo(
    () =>
      enableNewSettingFilter
        ? (crag: Crag) => {
            return (crag.futureSchedules || []).some(
              ({ type, date }) => type === 'new' && format(date, 'yyyy-MM-dd') === todayIso
            );
          }
        : () => {
            return true;
          },
    [enableNewSettingFilter, todayIso]
  );

  const filterCount = useMemo(() => {
    let count = 0;

    if (enableShowerFilter) {
      count += 1;
    }

    if (enableExceptionSettingFilter) {
      count += 1;
    }

    if (enableNewSettingFilter) {
      count += 1;
    }

    return count;
  }, [enableShowerFilter, enableExceptionSettingFilter, enableNewSettingFilter]);

  const isCragFiltered = useCallback(
    (crag: Crag) => {
      let _isFiltered = true;

      if (enableShowerFilter) {
        _isFiltered &&= showerFilter(crag);
      }

      if (enableExceptionSettingFilter) {
        _isFiltered &&= exceptionSettingFilter(crag);
      }

      if (enableNewSettingFilter) {
        _isFiltered &&= newSettingFilter(crag);
      }

      return _isFiltered;
    },
    [
      enableExceptionSettingFilter,
      enableNewSettingFilter,
      enableShowerFilter,
      exceptionSettingFilter,
      newSettingFilter,
      showerFilter,
    ]
  );

  return {
    sheetRef,
    isFilterSheetOpen,

    filterCount,

    enableShowerFilter,
    enableExceptionSettingFilter,
    enableNewSettingFilter,

    setEnableShowerFilter,
    setEnableExceptionSettingFilter,
    setEnableNewSettingFilter,

    showerFilter,
    exceptionSettingFilter,
    newSettingFilter,

    isCragFiltered,
  };
}
