import { Box, Typography } from '@mui/material';

export function CragDetailFooter() {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderTop: '1px solid #ddd',
        py: 2,
        px: 3,
      }}
    >
      <Typography variant="body2" fontWeight={600} gutterBottom>
        이미지 출처 및 주의사항
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, whiteSpace: 'normal' }}>
        서울암장 서비스에 사용된 암장 이미지는 네이버, 인스타그램 등 공개된 자료에서 수집된 것으로, 비영리적 목적(정보
        제공)을 위해 사용되고 있습니다. 이미지 사용에 문제가 있을 경우
        <strong> jeong5728@gmail.com </strong>으로 연락 주시면 즉시 조치하겠습니다.
      </Typography>
      <br />
      <br />
      <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
        ⓒ 서울암장 – 클라이머를 위한 암장 정보 서비스
      </Typography>
    </Box>
  );
}
