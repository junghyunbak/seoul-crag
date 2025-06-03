export function SquareMarker({ width }: { width: React.CSSProperties['width'] }) {
  return (
    <svg width={width} viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_406_39)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14 0H64C69.5228 0 74 4.47715 74 10V60C74 65.5228 69.5228 70 64 70H14C8.47715 70 4 65.5228 4 60V10C4 4.47715 8.47715 0 14 0ZM39.0952 43.1905C43.5661 43.1905 47.1905 39.5661 47.1905 35.0952C47.1905 30.6244 43.5661 27 39.0952 27C34.6244 27 31 30.6244 31 35.0952C31 39.5661 34.6244 43.1905 39.0952 43.1905Z"
          fill="var(--marker-bg-color)"
        />
        <path
          d="M47.1905 35.0952C47.1905 39.5661 43.5661 43.1905 39.0952 43.1905C34.6244 43.1905 31 39.5661 31 35.0952C31 30.6244 34.6244 27 39.0952 27C43.5661 27 47.1905 30.6244 47.1905 35.0952Z"
          fill="#FDF7EC"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_406_39"
          x="0"
          y="0"
          width="78"
          height="78"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_406_39" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_406_39" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
