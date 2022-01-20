import Image from 'next/image'

export default function Logo() {
  return (
    <Image
      src="/logo.svg"
      alt="Vexchange"
      width={40}
      height={37}
    />
  )
}
