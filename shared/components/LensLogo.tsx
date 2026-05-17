import type { FC } from 'react';

interface LensLogoProps {
  glyph: 'inflation' | 'construction';
  size?: number;
}

export const LensLogo: FC<LensLogoProps> = ({ glyph, size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" stroke="#00E5FF" strokeWidth="2" fill="none" />
      <circle cx="24" cy="24" r="18" stroke="#00E5FF" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M24 6 L30 12 L24 14 Z" fill="#00E5FF" opacity="0.3" />
      <path d="M42 24 L36 30 L34 24 Z" fill="#00E5FF" opacity="0.3" />
      <path d="M24 42 L18 36 L24 34 Z" fill="#00E5FF" opacity="0.3" />
      <path d="M6 24 L12 18 L14 24 Z" fill="#00E5FF" opacity="0.3" />
      {glyph === 'inflation' ? (
        <path
          d="M16 28 L20 24 L24 26 L28 20 L32 22"
          stroke="#00E5FF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ) : (
        <>
          <path
            d="M18 30 L18 24 L24 18 L30 24 L30 30 Z"
            stroke="#00E5FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <rect x="21" y="26" width="2" height="4" fill="#00E5FF" />
          <rect x="25" y="26" width="2" height="4" fill="#00E5FF" />
        </>
      )}
      <circle cx="24" cy="24" r="2" fill="#00E5FF" opacity="0.8" />
    </svg>
  );
};
