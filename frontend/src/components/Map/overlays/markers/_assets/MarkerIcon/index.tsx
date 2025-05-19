interface MarkerIconProps {
  width: number;
}

function ActiveMarkerIcon({ width }: MarkerIconProps) {
  return (
    <svg width={`${width}px`} viewBox="0 0 156 187" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_391_3)">
        <path
          d="M49.9263 65.4169C47.9263 68.2502 45.7263 74.0169 52.9263 74.4169L67.4263 75.4169L75.4262 86.9169C76.0929 87.5835 77.6262 88.5169 78.4262 86.9169L91.4262 65.4169C91.9262 64.5835 92.6262 62.4169 91.4262 60.4169L74.9262 32.9169C73.7596 31.9169 71.0262 30.5169 69.4262 32.9169L49.9263 65.4169Z"
          fill="#FDF7EC"
        />
        <path
          d="M94.9262 62.4169C94.4262 61.9169 93.7262 60.5169 94.9262 58.9169L97.9262 55.9169C98.7596 55.4169 100.726 54.7169 101.926 55.9169L130.426 100.417C131.26 101.75 132.326 104.917 129.926 106.917C128.426 106.917 124.926 108.417 121.926 105.417L94.9262 62.4169Z"
          fill="#FDF7EC"
        />
        <path
          d="M42.4263 76.4169L27.4262 103.917C26.5929 105.25 26.1262 108.017 30.9262 108.417H110.426C111.76 108.25 114.026 107.117 112.426 103.917L93.9262 73.9169L83.4262 91.9169C81.7596 94.4169 77.0262 97.9169 71.4262 91.9169L64.9263 82.4169L53.4263 81.9169C51.2596 81.4169 46.0263 79.6169 42.4263 76.4169Z"
          fill="#93A667"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25.4261 126.5L78.4262 178.5L129.926 126.5C151.009 105.417 162.426 66.5169 136.426 28.9169C110.426 -8.68314 49.4262 -10.5831 19.9262 28.9169C8.09285 42.4169 -11.5738 86.9169 25.4261 126.5ZM27.4262 103.917L42.4263 76.4169C46.0263 79.6169 51.2596 81.4169 53.4263 81.9169L64.9263 82.4169L71.4262 91.9169C77.0262 97.9169 81.7596 94.4169 83.4262 91.9169L93.9262 73.9169L112.426 103.917C114.026 107.117 111.76 108.25 110.426 108.417H30.9262C26.1262 108.017 26.5929 105.25 27.4262 103.917ZM52.9263 74.4169C45.7263 74.0169 47.9263 68.2502 49.9263 65.4169L69.4262 32.9169C71.0262 30.5169 73.7596 31.9169 74.9262 32.9169L91.4262 60.4169C92.6262 62.4169 91.9262 64.5835 91.4262 65.4169L78.4262 86.9169C77.6262 88.5169 76.0929 87.5835 75.4262 86.9169L67.4263 75.4169L52.9263 74.4169ZM94.9262 58.9169C93.7262 60.5169 94.4262 61.9169 94.9262 62.4169L121.926 105.417C124.926 108.417 128.426 106.917 129.926 106.917C132.326 104.917 131.26 101.75 130.426 100.417L101.926 55.9169C100.726 54.7169 98.7596 55.4169 97.9262 55.9169L94.9262 58.9169Z"
          fill="#6D8C57"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_391_3"
          x="0"
          y="0"
          width="155.449"
          height="186.5"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_391_3" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_391_3" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

interface InactiveMarkerIconProps extends MarkerIconProps {
  centerColor?: string;
  backgroundColor?: string;
}

function SquareMarkerIcon({ width, centerColor = '#FDF7EC', backgroundColor = '#6D8C57' }: InactiveMarkerIconProps) {
  return (
    <svg width={`${width * 0.6}px`} viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_406_39)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14 0H64C69.5228 0 74 4.47715 74 10V60C74 65.5228 69.5228 70 64 70H14C8.47715 70 4 65.5228 4 60V10C4 4.47715 8.47715 0 14 0ZM39.0952 43.1905C43.5661 43.1905 47.1905 39.5661 47.1905 35.0952C47.1905 30.6244 43.5661 27 39.0952 27C34.6244 27 31 30.6244 31 35.0952C31 39.5661 34.6244 43.1905 39.0952 43.1905Z"
          fill={backgroundColor}
        />
        <path
          d="M47.1905 35.0952C47.1905 39.5661 43.5661 43.1905 39.0952 43.1905C34.6244 43.1905 31 39.5661 31 35.0952C31 30.6244 34.6244 27 39.0952 27C43.5661 27 47.1905 30.6244 47.1905 35.0952Z"
          fill={centerColor}
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

function CircleMarkerIcon({ width, centerColor = '#FDF7EC', backgroundColor = '#6D8C57' }: InactiveMarkerIconProps) {
  return (
    <svg width={`${width * 0.6}px`} viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_391_12)">
        <path
          d="M74 35C74 54.33 58.33 70 39 70C19.67 70 4 54.33 4 35C4 15.67 19.67 0 39 0C58.33 0 74 15.67 74 35Z"
          fill={backgroundColor}
        />
        <path
          d="M47.3333 34.7619C47.3333 39.2328 43.709 42.8571 39.2381 42.8571C34.7672 42.8571 31.1429 39.2328 31.1429 34.7619C31.1429 30.291 34.7672 26.6667 39.2381 26.6667C43.709 26.6667 47.3333 30.291 47.3333 34.7619Z"
          fill={centerColor}
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

export const MarkerIcon = {
  Active: ActiveMarkerIcon,
  Inactive: {
    Square: SquareMarkerIcon,
    Circle: CircleMarkerIcon,
  },
};
