import React from 'react';
import { HeaderControl } from './HeaderControl';
import { meta } from '../meta';
import { DiscordIcon } from '../Icons';

export function DiscordControl() {
    return (
        <HeaderControl
            tooltip="Discord"
            component="a"
            href={meta.discordLink}
            sx={(theme) => ({
                color: theme.white,
                backgroundColor: meta.discordColor,
                borderColor: meta.discordColor,

                ...theme.fn.hover({
                    backgroundColor: theme.fn.lighten(meta.discordColor, 0.1),
                }),
            })}
        >
            <DiscordIcon size={20} />
        </HeaderControl>
    );
}
