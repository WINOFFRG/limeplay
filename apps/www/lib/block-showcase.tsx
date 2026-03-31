import type { ReactNode } from "react"

import { LinearMediaPlayer } from "@/registry/default/blocks/linear-player/components/media-player"
import { YouTubeMusicPlayer } from "@/registry/pro/blocks/youtube-music/components/media-player"

type BlockShowcaseDefinition = {
  component: () => ReactNode
  icon: ReactNode
}

function LinearIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0"
      fill="none"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957165.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.43566 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68399 5.1855ZM12.6587 18.074c-.3701-.3701-.393-.9637-.0443-1.3541C21.7795 6.45931 35.1114 0 49.9519 0 77.5927 0 100 22.4073 100 50.0481c0 14.8405-6.4593 28.1724-16.7199 37.3375-.3903.3487-.984.3258-1.3542-.0443L12.6587 18.074Z"
        fill="#222326"
      />
    </svg>
  )
}

function YouTubeMusicIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0"
      viewBox="4 4 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" fill="#f44336" r="20" />
      <polygon fill="#fff" points="21,29 29,24 21,19" />
      <path
        d="M24 14c5.5 0 10 4.476 10 10s-4.476 10-10 10S14 29.5 14 24 18.5 14 24 14"
        fill="none"
        stroke="#fff"
        strokeMiterlimit="10"
      />
    </svg>
  )
}

const blockShowcaseRegistry = {
  "linear-player": {
    component: () => (
      <section className="dark flex h-dvh w-dvw bg-black">
        <LinearMediaPlayer as="video" />
      </section>
    ),
    icon: <LinearIcon />,
  },
  "youtube-music": {
    component: () => <YouTubeMusicPlayer />,
    icon: <YouTubeMusicIcon />,
  },
} satisfies Record<string, BlockShowcaseDefinition>

export function getBlockIcon(preview: string): ReactNode | undefined {
  return blockShowcaseRegistry[preview as keyof typeof blockShowcaseRegistry]
    .icon
}

export function getBlockShowcase(preview: string) {
  return blockShowcaseRegistry[preview as keyof typeof blockShowcaseRegistry]
}
