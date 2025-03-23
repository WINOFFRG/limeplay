import { cn } from '@/lib/utils';

// Define the styles using Tailwind's CSS syntax
const styles = `
  @keyframes spinner {
    from {
      transform: rotate(0turn);
    }
    to {
      transform: rotate(1turn);
    }
  }

  .spinner {
    @apply block;
    animation: spinner 500ms linear infinite;
  }
`;

type SpinnerProps = {
	size?: number;
	className?: string;
};

export const Spinner = ({ size = 16, className }: SpinnerProps) => (
	<>
		<style>{styles}</style>
		<svg
			className={cn('spinner', className)}
			width={size}
			height={size}
			viewBox="0 0 16 16"
		>
			<circle
				cx="8"
				cy="8"
				r="6"
				stroke="currentColor"
				strokeOpacity="0.1"
				strokeWidth="1.5"
				fill="none"
			/>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
				fill="none"
				d="M13.7956 9.55291C14.2074 8.01584 13.9918 6.37811 13.1962 5C12.4005 3.6219 11.09 2.6163 9.55292 2.20445"
			/>
		</svg>
	</>
);
