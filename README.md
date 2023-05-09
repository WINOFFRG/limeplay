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

<h2 align="center"> 🚧 <b>This project is still in its early stages and is looking for contributors</b> 🚧 </h2>
<h3 align="center">🏗️ This project is under Heavy Development, Things might change anytime! 🏗️<h3>

<br>

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
$ yarn add @limeplay/core @limeplay/shaka-player

# or

$ npm i @limeplay/core @limeplay/shaka-player
```

## Usage

To start using the components, please follow these steps:

1. Player Setup

```jsx
import { useShakaPlayer } from "@limeplay/shaka-player";
import { LimeplayProvider, OverlayOutlet, MediaOutlet } from "@limeplay/core";

export default function Player() {
	const createPlayer = useShakaPlayer();

	return (
		<LimeplayProvider>
			<OverlayOutlet createPlayer={createPlayer}>
				<PlayerOverlay /> {/* Your custom overlay component */}
			</OverlayOutlet>
			<MediaOutlet>
				<video controls={false} playsInline autoPlay={false} />
			</MediaOutlet>
		</LimeplayProvider>
	);
}
```

2. Configure Playback and Controls Overlay

```jsx
import { useLimeplayStore, useLimeplayStoreAPI } from "@limeplay/core";
import { useEffect } from "react";

export default function PlayerOverlay() {
	const playback = useLimeplayStore((state) => state.playback);
	const player = useLimeplayStore((state) => state.player);
	const demoPlabackUrl =
		"https://storage.googleapis.com/nodejs-streaming.appspot.com/uploads/f6b7c492-e78f-4b26-b95f-81ea8ca21a18/1642708128072/manifest.mpd";

	useEffect(() => {
		if (player && player.getLoadMode() === 1) {
			const playerConfig = player.getConfiguration();

			player.load(demoPlabackUrl);
		}
	}, [player, playback]);

	return (
		<div className={classes.overlayWrapper}>
			<ControlsOverlay /> {/* Your custom controls component */}
		</div>
	);
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
