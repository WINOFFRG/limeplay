interface PlayerConfig {
    playback: {
        url: string;
        startTime?: number;
        drm?: {};
        prerolls: string[];
    };
    shaka: shaka.extern.PlayerConfiguration;
}

interface LimeplayRequiredProps {
	playback: HTMLMediaElement;
	player: shaka.Player;
}

interface HookProps {
	playback: HTMLMediaElement;
	player: shaka.Player;
}

type HTMLMediaElementEvents = Array<keyof HTMLMediaElementEventMap>;

type HTMLVideoElementEvents = Array<keyof HTMLVideoElementEventMap>;

type ShakaPlayerEvents = Array<
	| 'loading'
	| 'buffering'
	| 'trackschanged'
	| 'manifestparsed'
	| 'loaded'
	| 'trackschanged'
	| 'abrstatuschanged'
	| 'variantchanged'
	| 'adaptation'
>;

type UseGestureEvents = PointerEvent | MouseEvent | TouchEvent | KeyboardEvent;

interface CreateShakaPlayerProps {
	mediaElement: HTMLMediaElement;
}

type CreatePlayer = (props: CreateShakaPlayerProps) => shaka.Player;

declare module 'o9n' {
	export let orientation: ScreenOrientation;
}

interface HTMLVideoElement {
	webkitExitFullscreen(): void;
	webkitEnterFullscreen(): void;
	webkitSupportsFullscreen: boolean;
	webkitDisplayingFullscreen: boolean;
}

interface SeekRange {
	start: number;
	end: number;
}
