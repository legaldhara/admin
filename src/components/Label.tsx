 import type { LabelHTMLAttributes } from "react"

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string
}

export function Label({ className = "", ...props }: LabelProps) {
  return <label className={`block text-sm font-medium text-slate-300 ${className}`} {...props} />
}
