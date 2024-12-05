import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          variant === 'default' ? 'bg-primary text-primary-foreground hover:bg-primary/90' :
          variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' :
          variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' :
          variant === 'secondary' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' :
          variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' :
          variant === 'link' ? 'text-primary underline-offset-4 hover:underline' :
          ''
        } ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

