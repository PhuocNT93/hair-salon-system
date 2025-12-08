import * as React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, as: Component = "div", ...props }, ref) => {
        return (
            <Component
                ref={ref}
                className={cn(
                    "mx-auto w-full px-[1rem]", // Default padding
                    "max-w-full", // Mobile: 100%
                    "md:max-w-[720px]", // Tablet
                    "lg:max-w-[960px]", // Laptop
                    "xl:max-w-[1200px]", // Desktop
                    "2xl:max-w-[1440px]", // Wide
                    className
                )}
                {...props}
            />
        )
    }
)
Container.displayName = "Container"

export { Container }
