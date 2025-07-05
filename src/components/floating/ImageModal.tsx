'use client'

import { useImageModalStore } from '@/lib/imageModalStore'
import { X } from 'lucide-react'

const ImageModal = () => {
    const { isOpen, imageUrl, closeModal } = useImageModalStore()

    if (!isOpen || !imageUrl) return null


    return (
        <div className="">
            <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
                <button onClick={closeModal} className="cursor-pointer absolute top-4 right-4 text-white text-2xl">
                    <X />
                </button>
                <img
                    src={imageUrl}
                    alt="Modal"
                    className="max-h-[90%] max-w-[90%] object-contain rounded shadow-xl"
                />
            </div>
        </div>
    )
};

export default ImageModal


