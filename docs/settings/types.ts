import React from 'react';
import { Icon2fa } from '@tabler/icons';

export interface Category {
	title: string;
	icon?: React.FC;
	//   icon: (props: React.ComponentProps<typeof Icon2fa>) => JSX.Element;
}
