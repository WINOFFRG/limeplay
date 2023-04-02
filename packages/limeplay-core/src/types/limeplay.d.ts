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

type ShakaPlayerEvents = Array<
	'loading' | 'buffering' | 'trackschanged' | 'manifestparsed'
>;

type UseGestureEvents = PointerEvent | MouseEvent | TouchEvent | KeyboardEvent;