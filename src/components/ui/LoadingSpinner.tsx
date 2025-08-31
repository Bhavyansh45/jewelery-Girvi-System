import React from 'react'
import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={cn('flex items-center justify-center min-h-screen', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-4 border-gray-200 border-t-primary',
          sizeClasses[size]
        )}
      />
    </div>
  )
}

export default LoadingSpinner 