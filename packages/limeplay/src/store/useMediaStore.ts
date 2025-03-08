import { StateCreator } from 'zustand';

export interface MediaStore {
	/** Whether the media is playing. */
	paused: boolean;
	setPaused: (paused: boolean) => void;
	/** Whether the media has ended. */
	ended: boolean;
	setEnded: (ended: boolean) => void;
	/** Media duration, in seconds. */
	duration: number;
	setDuration: (duration: number) => void;
	/** Whether the media is muted. */
	muted: boolean;
	setMuted: (muted: boolean) => void;
	/** Media volume, between 0-1. */
	volume: number;
	setVolume: (volume: number) => void;
	/** Speed of media playback, where 1.0 is normal speed. */
	playbackRate: number;
	setPlaybackRate: (playbackRate: number) => void;
	/** Whether the media loops back to the beginning after ending. */
	loop: true | false;
	setLoop: (loop: true | false) => void;
}

export const createMediaStore: StateCreator<MediaStore, [], [], MediaStore> = (
	set
) => ({
	paused: false,
	setPaused: (paused: boolean) => set({ paused }),
	ended: false,
	setEnded: (ended: boolean) => set({ ended }),
	duration: 0,
	setDuration: (duration: number) => set({ duration }),
	muted: false,
	setMuted: (muted: boolean) => set({ muted }),
	volume: 1,
	setVolume: (volume: number) => set({ volume }),
	playbackRate: 1,
	setPlaybackRate: (playbackRate: number) => set({ playbackRate }),
	loop: false,
	setLoop: (loop: true | false) => set({ loop }),
});
