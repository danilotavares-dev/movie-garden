import LogoImg from '../../assets/logo-mgarden.png'

interface LogoProps {
  className?: string
}

export function Logo({ className = 'w-10 h-10' }: LogoProps) {
  return (
    <img
      className={`object-contain ${className}`}
      src={LogoImg}
      alt="Imagem da logo"
    />
  )
}
