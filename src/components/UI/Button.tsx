import { ReactNode } from "react"

interface ActionButtonProps {
    label: string
    color?: "primary" | "accent" | "red" | "default" | "blue"
    onClick?: () => void
    type?: "button" | "submit" | "reset"
    icon?: ReactNode // optional icon
    title?: string
}

export default function ActionButton({
    label,
    color = "default",
    onClick,
    type = "button",
    icon,
    title
}: ActionButtonProps) {
    const colorClasses =
        color === "red"
            ? "border-red-500 text-red-600 hover:bg-red-600 hover:text-on-primary"
            : color === "accent"
                ? "border-accent text-accent hover:bg-accent hover:text-on-accent"
                : color === "primary"
                    ? "border-primary text-primary hover:bg-primary hover:text-on-primary"
                    : color === "blue"
                    ? "bg-foreground text-background hover:text-accent"
                    : "border-foreground text-foreground hover:bg-muted hover:text-foreground"

    return (
        <button
            type={type}
            onClick={onClick}
            className={`flex items-center justify-center gap-2 border px-4 py-2 text-sm font-medium transition ${colorClasses}`}
            title={title}
        >
            {icon && icon}
            {label}
        </button>
    )
}
