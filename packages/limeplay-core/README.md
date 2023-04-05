<p align="center">
  <a href="https://github.com/winoffrg/limeplay">
    <!-- <img src="https://raw.githubusercontent.com/limeplay/limeplay/main/media/logo-colored@2x.png?raw=true" alt="Limeplay logo" width="300" /> -->
  </a>
</p>

<h1 align="center">🔰 Build Bullet Proof & Stunning Media Players at Ease</h1>
<br />

<p align="center">
  <img alt="Bundle Size" src="https://badgen.net/bundlephobia/minzip/@limeplay/core"/>
  <a href="https://github.com/winoffrg/limeplay/blob/main/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/github/license/WINOFFRG/limeplay"/>
  </a>
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@limeplay/core.svg?style=flat"/>
  <img alt="Github Stars" src="https://badgen.net/github/stars/WINOFFRG/limeplay" />
  <a href="https://discord.gg/winoffrg/limeplay">
    <img alt="Discord" src="https://badgen.net/discord/online-members/ZjXFzqmqjn?label=&icon=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2" />
  </a>
</p>

<br />

Limeplay is a React based component UI library build on top of [Shaka Player](
    https://github.com/shaka-project/shaka-player) that allows you to build stunning, accessible and modern looking Media Players with ease. It exposes several hooks and highly configurable components using which you can build any functional Media Player like Netflix, Youtube, Hulu, Hotstar, without having to worry about the underlying player logic while adhering to accessibility best practices.

<h2 align="center"> 🚧 <b>This project is still in its early stages and is looking for contributors</b> 🚧 </h2>
<h3 align="center">🏗️ This project is under Heavy Development, Things might change anytime! 🏗️<h3>

<br>

## Table of contents

- 📋 [Documentation](#documentation)
- 🚀 [Features](#features)
- 📦 [Installation](#installation)
- 💻 [Usage](#usage)
- 👋 [Support](#support)
- 📝 [Contributing](#contributing)
- ⚖️ [License](#license)

## Documentation

👉 It's the https://docs.limeplay.me website for the latest version of Limeplay.

## Features
- To be Added
- To be Added
- To be Added
- To be Added

## Installation

To use Limeplay UI components, all you need to do is install the
`@limeplay/core` package and its peer dependencies:

```sh
$ yarn add @limeplay/core @emotion/react@^11 @emotion/styled@^11

# or

$ npm i @limeplay/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^6
```

## Usage

To start using the components, please follow these steps:

1. Wrap your application with the `LimeplayProvider` provided by
   **@limeplay/core**.

```jsx
import { LimeplayProvider } from "@limeplay/core"

// Do this at the root of your application
function App({ children }) {
  return <LimeplayProvider>{children}</LimeplayProvider>
}
```

2. Import the components you want to use from **@limeplay/core** and wrap them
   with the `PlayerWrapper` component.

```jsx
import { PlayerWrapper, VideoWrapper, ControlsOverlay, PlaybackControl, VolumeControl } from "@limeplay/core"

function MyFullscreenPlayer() {
    return (
        <PlayerWrapper withShaka>
            <ControlsOverlay>
                <PlaybackControl />
                <VolumeControl />
            </ControlsOverlay>
            <VideoWrapper
                src="https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd"
                volume={0.5}
            />
        </PlayerWrapper>
    )
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
