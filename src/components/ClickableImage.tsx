'use client'

import { useImageModalStore } from '@/lib/imageModalStore'

const ClickableImage = ({ src, alt, className }: { src: string; alt?: string; className?: string }) => {
  const { openModal } = useImageModalStore()

  return (
    <img
      src={src}
      alt={alt}
      className={`cursor-pointer ${className}`}
      onClick={() => openModal(src)}
    />
  )
}

export default ClickableImage