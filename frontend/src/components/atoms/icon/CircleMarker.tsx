export function CircleMarker({ width }: { width: React.CSSProperties['width'] }) {
  return (
    <svg width={width} viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_391_12)">
        <path
          d="M74 35C74 54.33 58.33 70 39 70C19.67 70 4 54.33 4 35C4 15.67 19.67 0 39 0C58.33 0 74 15.67 74 35Z"
          fill="var(--marker-bg-color)"
        />
        <path
          d="M47.3333 34.7619C47.3333 39.2328 43.709 42.8571 39.2381 42.8571C34.7672 42.8571 31.1429 39.2328 31.1429 34.7619C31.1429 30.291 34.7672 26.6667 39.2381 26.6667C43.709 26.6667 47.3333 30.291 47.3333 34.7619Z"
          fill="#FDF7EC"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_391_12"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_391_12" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_391_12" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
