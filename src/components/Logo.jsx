export default function Logo({ variant = 'dark', height = 32 }) {
  const ink = variant === 'dark' ? '#ffffff' : '#1c1c1c';

  return (
    <svg
      role="img"
      aria-label="Sistenge"
      height={height}
      viewBox="0 0 220 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="6" width="36" height="36" rx="3" fill="#cf2927" />
      <text
        x="18"
        y="33"
        textAnchor="middle"
        fontFamily="Barlow Condensed, Arial, sans-serif"
        fontWeight="700"
        fontSize="26"
        fill="#ffffff"
      >S</text>
      <text
        x="46"
        y="32"
        fontFamily="Barlow Condensed, Arial, sans-serif"
        fontWeight="700"
        fontSize="24"
        letterSpacing="2"
        fill={ink}
      >SISTENGE</text>
      <text
        x="46"
        y="44"
        fontFamily="Barlow, Arial, sans-serif"
        fontWeight="500"
        fontSize="9"
        letterSpacing="3"
        fill={ink}
        opacity="0.7"
      >CONSTRUÇÕES E COMÉRCIO</text>
    </svg>
  );
}
