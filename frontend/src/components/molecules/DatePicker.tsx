import { Box, Typography, type SxProps, IconButton } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

import Picker from 'react-mobile-picker';

import { DAY_LABELS } from '@/constants';

import { endOfMonth } from 'date-fns';

export type DatePickerValue = {
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
  meridiem: '오전' | '오후';
};

const pickerKeys: (keyof DatePickerValue)[] = ['month', 'date', 'hour', 'minute', 'meridiem'];

const pickerKeyToSuffix: Record<keyof DatePickerValue, string> = {
  year: '년',
  month: '월',
  date: '일',
  hour: '시',
  minute: '분',
  meridiem: '',
};

const pickerKeyToSx: Record<keyof DatePickerValue, SxProps> = {
  year: {},
  month: {
    justifyContent: 'flex-end',
  },
  date: {
    justifyContent: 'flex-start',
  },
  hour: {
    justifyContent: 'flex-end',
  },
  minute: {
    justifyContent: 'flex-start',
  },
  meridiem: {},
};

// [ ]: 원정 시간이 설정되지 않은 경우, 현재 시간과 동기화
export function DatePicker({
  pickerValue,
  onChange,
  isRemoveActive = false,
  onRemove,
}: {
  pickerValue: DatePickerValue;
  onChange(value: DatePickerValue): void;
  isRemoveActive?: boolean;
  onRemove(): void;
}) {
  const { year, month } = pickerValue;

  const date = new Date(year, month - 1);

  const endDate = endOfMonth(date);

  const selections: { [P in keyof DatePickerValue]: DatePickerValue[P][] } = {
    year: [],
    month: Array(12)
      .fill(null)
      .map((_, i) => i + 1),
    date: Array(endDate.getDate())
      .fill(null)
      .map((_, i) => i + 1),
    hour: Array(12)
      .fill(null)
      .map((_, i) => i + 1),
    minute: Array(60)
      .fill(null)
      .map((_, i) => i),
    meridiem: ['오전', '오후'],
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ flex: 1 }}>
        <Picker
          value={pickerValue}
          onChange={(value) => {
            const next = { ...value };

            if (value.hour === 12 && pickerValue.hour !== value.hour) {
              next.meridiem = value.meridiem === '오전' ? '오후' : '오전';
            }

            onChange(next);
          }}
          height={100}
          wheelMode="natural"
        >
          {pickerKeys.map((pickerKey) => (
            <Picker.Column key={pickerKey} name={pickerKey}>
              {selections[pickerKey].map((option) => {
                const day = (() => {
                  if (pickerKey !== 'date' || typeof option !== 'number') {
                    return '';
                  }

                  const { year, month } = pickerValue;

                  return `(${DAY_LABELS[new Date(year, month - 1, option).getDay()]})`;
                })();

                return (
                  <Picker.Item key={option} value={option}>
                    {({ selected }) => {
                      return (
                        <Box sx={{ ...{ width: '100%', display: 'flex', px: 1 }, ...pickerKeyToSx[pickerKey] }}>
                          <Typography
                            sx={(theme) => ({
                              color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
                            })}
                          >
                            {`${option}${pickerKeyToSuffix[pickerKey]} ${day}`}
                          </Typography>
                        </Box>
                      );
                    }}
                  </Picker.Item>
                );
              })}
            </Picker.Column>
          ))}
        </Picker>
      </Box>

      {isRemoveActive && (
        <Box
          sx={{
            flexShrink: 0,
            px: 1,
          }}
        >
          <IconButton onClick={onRemove}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
