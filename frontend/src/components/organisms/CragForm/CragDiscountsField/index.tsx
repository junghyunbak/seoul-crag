import { useContext, useState, useMemo } from 'react';

import {
  Paper,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GroupDiscountSchema, TimeDiscountSchema, EventDiscountSchema, GymDiscountSchema } from '@/schemas/discount';
import { z } from 'zod';

import { DefaultError, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';

import { cragFormContext } from '@/components/organisms/CragForm/index.context';

import { DAYS_OF_KOR } from '@/constants/time';

import { Molecules } from '@/components/molecules';
import { Atoms } from '@/components/atoms';

import { DateService } from '@/utils/time';

import DatePicker from 'react-datepicker';

const discountTypeToKor: Record<GymDiscount['type'], string> = {
  event: '이벤트 할인',
  group: '단체 할인',
  time: '정기 할인',
};

const discountTypes: GymDiscount['type'][] = ['event', 'group', 'time'];

export function CragDiscountsField() {
  const [discountType, setDiscountType] = useState<GymDiscount['type']>('time');

  const schema = useMemo(() => {
    switch (discountType) {
      case 'group':
        return GroupDiscountSchema.omit({ id: true });
      case 'time':
        return TimeDiscountSchema.omit({ id: true });
      case 'event':
        return EventDiscountSchema.omit({ id: true });
    }
  }, [discountType]);

  return (
    <CragDiscountsFieldWrapper
      key={discountType}
      schema={schema}
      onTypeChange={(discountType) => {
        setDiscountType(discountType);
      }}
      discountType={discountType}
    />
  );
}

interface CragDiscountsFieldWrapperProps {
  discountType: GymDiscount['type'];
  schema: z.ZodSchema;
  onTypeChange: (discountType: GymDiscount['type']) => void;
}

export function CragDiscountsFieldWrapper({ discountType, schema, onTypeChange }: CragDiscountsFieldWrapperProps) {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const queryClient = useQueryClient();

  const methods = useForm<GymDiscount>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: discountType,
    } as any,
  });

  const { handleSubmit, watch, reset } = methods;

  const type = watch('type');

  const createGymDiscountMutation = useMutation<void, DefaultError, Partial<GymDiscount>>({
    mutationFn: async (props) => {
      await api.post(`/gyms/${crag.id}/discounts`, {
        ...props,
      });

      revalidateCrag();

      queryClient.invalidateQueries({ queryKey: ['crag', 'discounts', crag.id] });
    },
  });

  const onSubmit = async (data: GymDiscount) => {
    await createGymDiscountMutation.mutateAsync(data);
  };

  return (
    <FormProvider {...methods}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">할인 정보</Typography>

        <DiscountList />

        <Paper>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 2 }}>
              <FormControl>
                <InputLabel>타입</InputLabel>
                <Select
                  onChange={(e) => {
                    const newType = e.target.value as GymDiscount['type'];

                    onTypeChange(newType);

                    reset({ type: newType } as any);
                  }}
                  value={discountType}
                  label="타입"
                >
                  {discountTypes.map((discountType) => (
                    <MenuItem key={discountType} value={discountType}>
                      {discountTypeToKor[discountType]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Divider />

            <Box sx={{ p: 2 }}>
              <CommonFields />
            </Box>

            <Divider />

            <Box sx={{ p: 2 }}>
              {type === 'group' && <GroupFields />}
              {type === 'time' && <TimeFields />}
              {type === 'event' && <EventFields />}

              <Box mt={2}>
                <Button variant="contained" type="submit">
                  제출
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </FormProvider>
  );
}

function CommonFields() {
  const { register } = useFormContext<GymDiscount>();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="할인 가격" type="number" {...register('price', { valueAsNumber: true })} fullWidth />
      <TextField label="설명" {...register('description')} fullWidth />
    </Box>
  );
}

function GroupFields() {
  const { register } = useFormContext<GymDiscount>();
  return (
    <Box>
      <TextField label="최소 인원" type="number" {...register('min_group_size', { valueAsNumber: true })} fullWidth />
    </Box>
  );
}

function TimeFields() {
  const { watch, setValue } = useFormContext<GymDiscount>();

  const weekday = watch('weekday');

  const start = watch('time_start');
  const end = watch('time_end');

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Molecules.DayPicker currentDay={weekday} onChange={(day) => setValue('weekday', day)} />

      <Box sx={{ py: 2, px: 2.5 }}>
        <Molecules.TimeRangeSlider
          start={start ? DateService.timeStrToMinute(start) : 0}
          end={end ? DateService.timeStrToMinute(end) : 1439}
          onChange={(start, end) => {
            setValue('time_start', DateService.minuteToTimeStr(start));
            setValue('time_end', DateService.minuteToTimeStr(end));
          }}
        />
      </Box>
    </Box>
  );
}

function EventFields() {
  const { register, watch, setValue } = useFormContext<GymDiscount>();

  const start = watch('time_start');
  const end = watch('time_end');

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField label="날짜" type="date" {...register('date')} fullWidth />

      <Box sx={{ py: 2, px: 2.5 }}>
        <Molecules.TimeRangeSlider
          start={start ? DateService.timeStrToMinute(start) : 0}
          end={end ? DateService.timeStrToMinute(end) : 1439}
          onChange={(start, end) => {
            setValue('time_start', DateService.minuteToTimeStr(start));
            setValue('time_end', DateService.minuteToTimeStr(end));
          }}
        />
      </Box>
    </Box>
  );
}

function DiscountList() {
  const { crag } = useContext(cragFormContext);

  const { data: discounts } = useQuery({
    queryKey: ['crag', 'discounts', crag.id],
    queryFn: async () => {
      const { data } = await api.get(`/gyms/${crag.id}/discounts`);

      const discounts = z.array(GymDiscountSchema).parse(data);

      return discounts;
    },
    initialData: crag.gymDiscounts,
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {discounts
        .sort((a, b) => (a.id < b.id ? -1 : 1))
        .map((gymDiscount) => {
          return <DiscountListItem gymDiscount={gymDiscount} key={gymDiscount.id} />;
        })}
    </Box>
  );
}

function DiscountListItem({ gymDiscount }: { gymDiscount: GymDiscount }) {
  const { crag } = useContext(cragFormContext);

  const [locked, setLocked] = useState(true);

  const queryClient = useQueryClient();

  const removeGymDiscountMutation = useMutation({
    mutationFn: async (gymDiscountId: string) => {
      await api.delete(`/gyms/${crag.id}/discounts/${gymDiscountId}`);

      queryClient.invalidateQueries({ queryKey: ['crag', 'discounts', crag.id] });
    },
  });

  const updateGymDiscountMutation = useMutation<
    void,
    DefaultError,
    Pick<GymDiscount, 'id'> & Partial<MyOmit<GymDiscount, 'id'>>
  >({
    mutationFn: async ({ id, ...other }) => {
      await api.patch(`/gyms/${crag.id}/discounts/${id}`, {
        ...other,
      });

      queryClient.invalidateQueries({ queryKey: ['crag', 'discounts', crag.id] });
    },
  });

  return (
    <Paper sx={{ display: 'flex', gap: 1, p: 2, flexDirection: 'column' }}>
      <Atoms.Text.Title>{discountTypeToKor[gymDiscount.type]}</Atoms.Text.Title>

      {(() => {
        if (gymDiscount.type === 'group') {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SupervisorAccountIcon />
              {locked ? (
                <Atoms.Text.Body>{`>= ${gymDiscount.min_group_size}명`}</Atoms.Text.Body>
              ) : (
                <Molecules.AutoSaveTextField
                  value={gymDiscount.min_group_size.toString()}
                  onSave={async (value) => {
                    const groupSize = +value;

                    if (isNaN(groupSize)) {
                      throw new Error('숫자만 입력 가능합니다.');
                    }

                    const nextDiscount: z.infer<typeof GroupDiscountSchema> = {
                      ...gymDiscount,
                      min_group_size: groupSize,
                    };

                    updateGymDiscountMutation.mutate(nextDiscount);
                  }}
                />
              )}
            </Box>
          );
        }

        if (gymDiscount.type === 'event') {
          return (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonthIcon />
                {locked ? (
                  <Atoms.Text.Body>{`${gymDiscount.date}`}</Atoms.Text.Body>
                ) : (
                  <DatePicker
                    selected={DateService.dateStrToDate(gymDiscount.date)}
                    onChange={async (date) => {
                      if (!date) {
                        return;
                      }

                      const nextDiscount: z.infer<typeof EventDiscountSchema> = {
                        ...gymDiscount,
                        date: new DateService(date).dateStr,
                      };

                      await updateGymDiscountMutation.mutate(nextDiscount);
                    }}
                    customInput={<TextField label="이벤트 날짜" />}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon />
                {locked ? (
                  <Atoms.Text.Body>{`${gymDiscount.time_start} ~ ${gymDiscount.time_end}`}</Atoms.Text.Body>
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      pt: 3,
                    }}
                  >
                    <Molecules.TimeRangeSlider
                      start={DateService.timeStrToMinute(gymDiscount.time_start)}
                      end={DateService.timeStrToMinute(gymDiscount.time_end)}
                      onChange={(start, end) => {
                        const nextDiscount: z.infer<typeof EventDiscountSchema> = {
                          ...gymDiscount,
                          time_start: DateService.minuteToTimeStr(start),
                          time_end: DateService.minuteToTimeStr(end),
                        };

                        updateGymDiscountMutation.mutate(nextDiscount);
                      }}
                    />
                  </Box>
                )}
              </Box>
            </>
          );
        }

        if (gymDiscount.type === 'time') {
          return (
            <>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <DateRangeIcon />
                {locked ? (
                  <Atoms.Text.Body>{`${DAYS_OF_KOR[gymDiscount.weekday]}`}</Atoms.Text.Body>
                ) : (
                  <Molecules.DayPicker
                    currentDay={gymDiscount.weekday}
                    onChange={(day) => {
                      const nextDiscount: z.infer<typeof TimeDiscountSchema> = { ...gymDiscount, weekday: day };

                      updateGymDiscountMutation.mutate(nextDiscount);
                    }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon />
                {locked ? (
                  <Atoms.Text.Body>{`${gymDiscount.time_start} ~ ${gymDiscount.time_end}`}</Atoms.Text.Body>
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      pt: 3,
                    }}
                  >
                    <Molecules.TimeRangeSlider
                      start={DateService.timeStrToMinute(gymDiscount.time_start)}
                      end={DateService.timeStrToMinute(gymDiscount.time_end)}
                      onChange={(start, end) => {
                        const nextDiscount: z.infer<typeof TimeDiscountSchema> = {
                          ...gymDiscount,
                          time_start: DateService.minuteToTimeStr(start),
                          time_end: DateService.minuteToTimeStr(end),
                        };

                        updateGymDiscountMutation.mutate(nextDiscount);
                      }}
                    />
                  </Box>
                )}
              </Box>
            </>
          );
        }

        return null;
      })()}

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <PaidIcon />
        {locked ? (
          <Atoms.Text.Body>{gymDiscount.price.toLocaleString() + '원'}</Atoms.Text.Body>
        ) : (
          <Molecules.AutoSaveTextField
            value={gymDiscount.price.toString()}
            onSave={async (value) => {
              const price = +value;

              if (isNaN(price)) {
                throw new Error('숫자만 입력 가능합니다.');
              }

              updateGymDiscountMutation.mutate({ ...gymDiscount, price });
            }}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Box>
          <Button
            variant={locked ? 'outlined' : 'contained'}
            onClick={() => {
              setLocked(!locked);
            }}
          >
            {locked ? '잠금 해제' : '잠금'}
          </Button>
        </Box>

        <Button
          variant="contained"
          color="error"
          onClick={async () => {
            const confirm = window.confirm('정말 삭제하시겠습니까?');

            if (confirm) {
              await removeGymDiscountMutation.mutateAsync(gymDiscount.id);
            }
          }}
          disabled={locked}
        >
          삭제
        </Button>
      </Box>
    </Paper>
  );
}
