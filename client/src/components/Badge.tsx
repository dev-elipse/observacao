import React from 'react'

interface BadgeProps {
  status: string
  variant: 'blue' | 'orange' | 'green'
}

const variantClasses: Record<BadgeProps['variant'], string> = {
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-600',
  green: 'bg-emerald-100 text-emerald-700',
}

const Badge: React.FC<BadgeProps> = ({ status, variant }) => (
  <span className={`inline-block text-[11px] font-bold px-3 py-0.5 rounded-full tracking-wider whitespace-nowrap ${variantClasses[variant]}`}>
    {status}
  </span>
)

export default Badge
