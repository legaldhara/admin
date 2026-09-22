import type { LabelInputProps } from "../utils/types"
import { HomeIcon as House } from "lucide-react"

function Input({ type = "text", placeholder, name, onChange, value, size = "medium", showLabel = true, disabled = false, readOnly = false }: LabelInputProps & { disabled?: boolean; readOnly?: boolean }) {
  
  const sizeClasses = {
    small: "py-1 px-3 text-sm md:w-48 w-full", // Full width on mobile, fixed on desktop
    medium: "py-3 px-4 text-base md:w-72 w-full", 
    large: "py-4 px-5 text-lg md:w-96 w-full", 
  }

  return (
    <div className="mb-4 w-full">
      {showLabel && (
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-white">
          {name}
        </label>
      )}

      <div className={`flex items-center bg-[#f5f5f5] rounded-full border border-gray-200 ${sizeClasses[size]}`}>
        <input
          onChange={onChange}
          type={type}
          value={value}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className="bg-transparent w-full text-[#3f3f3f] placeholder-[#a3a3a3] focus:outline-none"
        />
        <House className="text-gray-500 mr-4" />
      </div>
    </div>
  )
}

export default Input

