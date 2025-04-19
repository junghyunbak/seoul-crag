export function roleToKor(roleName: Role['name']) {
  switch (roleName) {
    case 'owner':
      return '운영자';
    case 'gym_admin':
      return '암장 관리자';
    case 'partner_admin':
      return '제휴 암장 관리자';
  }
}
