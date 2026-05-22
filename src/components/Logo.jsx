export default function Logo({ variant = 'dark', height = 36 }) {
  const src = variant === 'dark'
    ? '/sistenge-logo-dark-bg.svg'
    : '/sistenge-logo-light-bg.svg';

  return (
    <img
      src={src}
      alt="Sistenge Construções e Comércio"
      height={height}
      style={{ display: 'block', height, width: 'auto' }}
    />
  );
}
