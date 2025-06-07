import { useRef, useState } from 'react';

import {
  List,
  Box,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material';

import { useFetchAllRoles, useFetchUserRoles, useFetchUsers, useMutateGrantRole, useMutateRevokeRole } from '@/hooks';

import { SwitchBaseProps } from 'node_modules/@mui/material/esm/internal/SwitchBase';

import { roleToKor } from '@/utils';

import dayjs from 'dayjs';
import { Molecules } from '@/components/molecules';

export default function ManageUsers() {
  const { users } = useFetchUsers();

  if (!users) {
    return null;
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        p: 2,
      }}
    >
      <Typography variant="h3">사용자 관리</Typography>
      <Paper>
        <TableContainer sx={{ overflowY: 'visible' }}>
          <Table stickyHeader>
            <colgroup>
              <col style={{ width: '13.3%' }} />
              <col style={{ width: '13.3%' }} />
              <col style={{ width: '13.3%' }} />
              <col style={{ width: '30%' }} />
              <col style={{ width: '30%' }} />
            </colgroup>

            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>사용자 이름</TableCell>
                <TableCell>가입일</TableCell>
                <TableCell>권한</TableCell>
                <TableCell>관리 암장</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{dayjs(user.created_at).format('YYYY년 MM월 DD일')}</TableCell>
                    <TableCell>
                      <RoleController userId={user.id} initialRoles={user.userRoles.map(({ role }) => role)} />
                    </TableCell>
                    <TableCell />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

interface RoleControllerProps {
  userId: string;
  initialRoles: Role[];
}

function RoleController({ initialRoles, userId }: RoleControllerProps) {
  const referenceRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [queryEnabled, setQueryEnabled] = useState(false);

  const { roles } = useFetchAllRoles();
  const { userRoles } = useFetchUserRoles({ userId, initialData: initialRoles, enabled: queryEnabled });

  const { grantMutation } = useMutateGrantRole({
    userId,
    onSuccess() {
      if (!queryEnabled) {
        setQueryEnabled(true);
      }
    },
  });

  const { revokeMutation } = useMutateRevokeRole({
    userId,
    onSuccess() {
      if (!queryEnabled) {
        setQueryEnabled(true);
      }
    },
  });

  const handleRoleChange =
    (roleId: string): SwitchBaseProps['onChange'] =>
    (e) => {
      if (e.target.checked) {
        grantMutation.mutate({ userId, roleId });
      } else {
        revokeMutation.mutate({ userId, roleId });
      }
    };

  return (
    <Box ref={referenceRef}>
      <Stack gap={1} direction="row">
        <Button variant="outlined" onClick={() => setIsOpen(!isOpen)}>
          수정
        </Button>

        <Stack gap={0.5} direction="row">
          {userRoles.map((role) => (
            <Chip key={role.id} label={roleToKor(role.name)} />
          ))}
        </Stack>
      </Stack>

      <Molecules.NonModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        referenceRef={referenceRef}
      >
        <List>
          {roles &&
            roles.map((role) => {
              return (
                <ListItem key={role.id}>
                  <Checkbox
                    checked={userRoles.map((role) => role.id).includes(role.id)}
                    onChange={handleRoleChange(role.id)}
                  />
                  {roleToKor(role.name)}
                </ListItem>
              );
            })}
        </List>
      </Molecules.NonModal>
    </Box>
  );
}
