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
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GymDiscountSchema } from '@/schemas/discount';
import { DefaultError, useMutation } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { useContext } from 'react';
import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

export function CragDiscountsField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const methods = useForm<GymDiscount>({
    resolver: zodResolver(GymDiscountSchema),
    defaultValues: {
      type: 'group',
    } as any,
  });

  const { handleSubmit, watch } = methods;
  const type = watch('type');

  const createGymDiscountMutation = useMutation<void, DefaultError, Partial<GymDiscount>>({
    mutationFn: async (props) => {
      api.post(`/gyms/${crag.id}/discounts`, {
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
        <Paper>
          <form onSubmit={handleSubmit(onSubmit)}>
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
      <FormControl>
        <InputLabel>타입</InputLabel>
        <Select {...register('type')} defaultValue="group" label="타입">
          <MenuItem value="group">단체 할인</MenuItem>
          <MenuItem value="time">시간 할인</MenuItem>
          <MenuItem value="event">이벤트 할인</MenuItem>
        </Select>
      </FormControl>
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
