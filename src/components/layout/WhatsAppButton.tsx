'use client'

import { FaWhatsapp } from 'react-icons/fa6'
import {
  buildWhatsAppHref,
  DEFAULT_WHATSAPP_MESSAGE,
} from '@/lib/whatsapp'

const DEFAULT_MESSAGE = DEFAULT_WHATSAPP_MESSAGE

type WhatsAppButtonProps = {
  readonly position?: 'left' | 'right'
  readonly message?: string
}

export function WhatsAppButton({
  position = 'right',
  message = DEFAULT_MESSAGE,
}: WhatsAppButtonProps) {
  const href = buildWhatsAppHref(message)

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
