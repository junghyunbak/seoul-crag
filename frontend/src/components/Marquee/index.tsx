import React from 'react';
import Marquee from 'react-fast-marquee';

const noticeTexts = [
  `📢 이미지에 출처를 표기했지만 문제가 될 경우 즉시 삭제하겠습니다. 댓글로 알려주세요.`,
  `📅 세팅 날짜, 휴무일 정보는 인스타그램을 참고하여 수기로 정리한 내용입니다. 실제 관리자가 지정되기 전까지는 반드시 한 번 더 확인해 주세요.`,
];

const NoticeMarquee: React.FC = () => {
  return (
    <div
      style={{
        width: '100dvw',
        backgroundColor: '#000',
        padding: '0.75rem 0',
        overflow: 'hidden',
        color: '#fff',
      }}
    >
      <Marquee gradient={false} pauseOnHover direction="left">
        {noticeTexts.map((noticeText, index) => (
          <p
            key={index}
            style={{
              fontSize: '0.875rem',
              margin: '0 1rem',
            }}
          >
            {noticeText}
          </p>
        ))}
      </Marquee>
    </div>
  );
};

export default NoticeMarquee;
