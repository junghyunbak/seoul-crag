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
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GroupDiscountSchema, TimeDiscountSchema, EventDiscountSchema } from '@/schemas/discount';
import { z } from 'zod';

import { DefaultError, useMutation } from '@tanstack/react-query';
import { api } from '@/api/axios';

import { cragFormContext } from '@/components/organisms/CragForm/index.context';

import { DAYS_OF_KOR } from '@/constants/time';

const discountTypeToKor: Record<GymDiscount['type'], string> = {
  event: '[이벤트 할인]',
  group: '[단체 할인]',
  time: '[정기 할인]',
};

const discountTypes: GymDiscount['type'][] = ['event', 'group', 'time'];

export function CragDiscountsField() {
  const [discountType, setDiscountType] = useState<GymDiscount['type']>('group');

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
    },
  });

  const onSubmit = async (data: GymDiscount) => {
    await createGymDiscountMutation.mutateAsync(data);

    revalidateCrag();
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
  const { register } = useFormContext<GymDiscount>();
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="요일 (0=일요일 ~ 6=토요일)"
        type="number"
        {...register('weekday', { valueAsNumber: true })}
        fullWidth
      />
      <TextField
        label="시작 시간"
        type="time"
        slotProps={{ htmlInput: { step: 1 } }}
        {...register('time_start')}
        fullWidth
      />
      <TextField
        label="종료 시간"
        type="time"
        slotProps={{ htmlInput: { step: 1 } }}
        {...register('time_end')}
        fullWidth
      />
    </Box>
  );
}

function EventFields() {
  const { register } = useFormContext<GymDiscount>();
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField label="날짜" type="date" {...register('date')} fullWidth />
      <TextField
        label="시작 시간"
        type="time"
        slotProps={{ htmlInput: { step: 1 } }}
        {...register('time_start')}
        fullWidth
      />
      <TextField
        label="종료 시간"
        type="time"
        slotProps={{ htmlInput: { step: 1 } }}
        {...register('time_end')}
        fullWidth
      />
    </Box>
  );
}

function DiscountList() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const removeGymDiscountMutation = useMutation({
    mutationFn: async (gymDiscountId: string) => {
      await api.delete(`/gyms/${crag.id}/discounts/${gymDiscountId}`);
    },
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {crag.gymDiscounts.map((gymDiscount) => {
        return (
          <Box key={gymDiscount.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              {(() => {
                if (gymDiscount.type === 'group') {
                  return (
                    <Typography>
                      {`${discountTypeToKor[gymDiscount.type]} ${gymDiscount.min_group_size}명 이상일 때 ${
                        gymDiscount.price
                      }원`}
                    </Typography>
                  );
                }

                if (gymDiscount.type === 'event') {
                  return (
                    <Typography>
                      {`${discountTypeToKor[gymDiscount.type]} ${gymDiscount.date} (${gymDiscount.time_start} ~ ${
                        gymDiscount.time_end
                      }) ${gymDiscount.price}원`}
                    </Typography>
                  );
                }

                return (
                  <Typography>{`${discountTypeToKor[gymDiscount.type]} ${DAYS_OF_KOR[gymDiscount.weekday]} (${
                    gymDiscount.time_start
                  } ~ ${gymDiscount.time_end}) ${gymDiscount.price}원`}</Typography>
                );
              })()}
            </Box>

            <IconButton
              onClick={async () => {
                await removeGymDiscountMutation.mutateAsync(gymDiscount.id);

                revalidateCrag();
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })}
    </Box>
  );
}
