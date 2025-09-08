import React from 'react'
import { clsx } from 'clsx'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

interface AlertProps {
  children: React.ReactNode
  variant?: 'error' | 'warning' | 'success' | 'info'
  className?: string
}

const icons = {
  error: XCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
}

export function Alert({ children, variant = 'info', className }: AlertProps) {
  const Icon = icons[variant]

  return (
    <div
      className={clsx(
        'alert',
        {
          'alert-error': variant === 'error',
          'alert-warning': variant === 'warning',
          'alert-success': variant === 'success',
          'alert-info': variant === 'info',
        },
        className
      )}
    >
      <div className="flex">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5 mr-3" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}