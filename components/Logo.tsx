import Image from 'next/image';

type LogoProps = {
  href?: string;
  subline?: string;
  className?: string;
};

export function Logo({
  href = '/',
  subline = 'ONE CORE PLATFORM + SPECIALIZED CARE PACKAGES',
  className = '',
}: LogoProps) {
  return (
    <a className={`logo ${className}`.trim()} href={href} aria-label="Care Axis home">
      <span className="logo-image-wrap" aria-hidden="true">
        <Image
          src="/care-axis-logo.png"
          alt=""
          className="logo-image"
          width={1226}
          height={768}
        />
      </span>
      {subline ? <span className="logo-subline">{subline}</span> : null}
    </a>
  );
}
