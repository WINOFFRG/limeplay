import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary',
				destructive:
					'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive',
				outline:
					'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary',
				ghost: 'hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent',
				link: 'text-primary underline-offset-4 hover:underline focus-visible:ring-primary',
				glass: 'bg-transparent text-foreground backdrop-blur-[1px] hover:backdrop-blur-md hover:bg-white/10 active:scale-[0.97] focus-visible:ring-white/50 focus-visible:bg-white/10',
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
				lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
				icon: 'size-8 p-2 rounded-md',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				data-slot="button"
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);

Button.displayName = 'Button';

export { Button, buttonVariants };
