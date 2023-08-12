import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

const LimeplayPlayer = dynamic(() => import("./components/player"), {
	ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

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
