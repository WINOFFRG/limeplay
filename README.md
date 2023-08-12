<h1 align="center">🔰 Build Bullet Proof & Stunning Media Players at Ease</h1>

<p align="center">
  <a href="https://bundlephobia.com/package/@limeplay/core">
  	<img alt="Bundle Size" src="https://badgen.net/bundlephobia/minzip/@limeplay/core"/>
  </a>
  <a href="https://github.com/winoffrg/limeplay/blob/main/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/github/license/WINOFFRG/limeplay"/>
  </a>
  <a href="https://www.npmjs.com/package/@limeplay/core">
  	<img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@limeplay/core.svg?style=flat"/>
  </a>
  <a href="https://discord.gg/winoffrg/limeplay">
  	<img alt="Github Stars" src="https://badgen.net/github/stars/WINOFFRG/limeplay" />
  </a>
  <a href="https://discord.gg/winoffrg/limeplay">
    <img alt="Discord" src="https://badgen.net/discord/online-members/ZjXFzqmqjn?label=&icon=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/winoffrg/limeplay">
    <img src="https://limeplay.me/og/default.jpg" alt="Limeplay logo"/>
  </a>
</p>

Limeplay is a React based Headless UI library made to work with HTML5 & [Shaka Player](https://github.com/shaka-project/shaka-player) that allows you to build stunning, accessible and modern looking Media Players with ease. It exposes several hooks and highly configurable components using which you can build any functional Media Player like Netflix, Youtube, Hulu, Hotstar, without having to worry about the underlying player logic while adhering to accessibility best practices.

> **Warning**
> This project is under Heavy Development, Things might change anytime.

## Table of contents

-   📋 [Documentation](#documentation)
-   🚀 [Features](#features)
-   📦 [Installation](#installation)
-   💻 [Usage](#usage)
-   👋 [Support](#support)
-   📝 [Contributing](#contributing)
-   ⚖️ [License](#license)

## Documentation

👉 It's the https://docs.limeplay.me website for the latest version of Limeplay.

<!-- ## Features
- To be Added
- To be Added
- To be Added
- To be Added -->

## Installation

To use Limeplay UI components, all you need to do is install the
`@limeplay/core` package and its peer dependencies:

```sh
npm i @limeplay/core
```

## Usage

To start using the components, please follow these steps:

1. LimeplayProvider is the context for accessing the player instance and playback element using `useLimeplay` hook. `MediaOutlet` is required so that limeplay can attach the `HTMLMediaElement` to store and setup the player instance.

```tsx
// Player.tsx
import { LimeplayProvider, MediaOutlet } from "@limeplay/core";
import { PlayerOutlet } from "./PlayerOutlet.tsx";

export default function Player() {

	return (
		<LimeplayProvider>
				<PlayerOutlet />
				<MediaOutlet>
					<video
						controls={false}
						autoPlay
					/>
				</MediaOutlet>
		</LimeplayProvider>
	);
}
```

2. `useShakaPlayer` hook is used to create an instance of `player` user is responsible for managing the actions like loading, error handling, etc on their own. Refer [Shaka Player Docs](https://shaka-player-demo.appspot.com/docs/api/tutorial-basic-usage.html) for basic usage.

```tsx
// PlayerOutlet.tsx
export function PlayerOutlet() {
	const { isLoaded, error } = useShakaPlayer();
	const { player } = useLimeplay();

	useEffect(() => {
		if (player && player.getLoadMode() !== 0) {
		}

		const config = player.getConfiguration();

		player.configure(config);

		const url = 'https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8';

		player.load(url);

		window.player = player;

	}, [player, isLoaded]);

	if (!isLoaded) return null;

	// Implement your own Controls Overlay using custom hooks
	return <ControlsOverlay /> ;
}
```

## Support & Discussion

More guides on how to get started are available [here](https://docs.limeplay.com/pages/getting-started)
For issues, discussion, and support, please join our [Discord Server](https://discord.gg/ZjXFzqmqjn).

## Contributing

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!

## License

MIT © [WINOFFRG](https://github.com/winoffrg)
