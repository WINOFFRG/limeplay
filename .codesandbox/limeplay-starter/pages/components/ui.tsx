import { Icon } from "@phosphor-icons/react";
import { forwardRef } from "react";

export const IconButton = forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
	return (
		<button
			className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ring-blue-400'
			ref={ref}
			{...props}
		>
			{children}
		</button>
	);
});

IconButton.displayName = "IconButton";
