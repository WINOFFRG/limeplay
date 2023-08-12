import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'] });

/**
 * Limeplay uses Shaka Player as it's core engine. Limeplay is just a frontend or UI for
 * this player enginer. Shaka is a very advanced player that supports a lot of features
 * which you may check from https://github.com/shaka-project/shaka-player For any queries
 * related to player please refer to Shaka Player documentation.
 *
 * Here, Shaka Player is just a client side library and it is not included in the server,
 * hence we need to dynamically import it using next/dynamic and disable server side rendering
 * so that we dont get errors like navigator is not defined.
 */

const LimeplayPlayer = dynamic(() => import('./components/player'), {
	ssr: false,
});

export default function Home() {
	return (
		<main
			id='limeplay-fs'
			className={`absolute flex items-center justify-center w-screen h-screen ${inter.className}`}
		>
			<LimeplayPlayer />
		</main>
	);
}
