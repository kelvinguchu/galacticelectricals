'use client'

import { FaWhatsapp } from 'react-icons/fa6'

const WHATSAPP_NUMBER = '254743312254'
const DEFAULT_MESSAGE = 'Hi Galactic, I am interested in your products'

type WhatsAppButtonProps = {
  readonly position?: 'left' | 'right'
  readonly message?: string
}

export function WhatsAppButton({
  position = 'right',
  message = DEFAULT_MESSAGE,
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <a
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-5 z-50 flex items-center justify-center rounded-full bg-[#25D366] p-3 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
        position === 'left' ? 'left-5' : 'right-5'
      }`}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <FaWhatsapp className="size-6" />
    </a>
  )
}
