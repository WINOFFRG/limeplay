import Link from "next/link";

// import { AnimatedGroup } from "@/components/ui/animated-group"
import AnimatedButtons from "@/components/hero-buttons";
import { Icons } from "@/components/icons";

export function Hero() {
  return (
    <div className="flex flex-col">
      {/* <AnimatedGroup preset="blur-slide"> */}
      <div
        className={
          "z-10 mx-auto mt-28 flex max-w-7xl flex-col px-4 pb-4 text-center sm:px-6 md:mt-36 md:px-8 md:pb-16 lg:mt-60 lg:px-8 xl:mt-32 xl:pt-32"
        }
      >
        <h1
          className={
            "mx-auto max-w-4xl text-balance font-semibold text-3xl text-black leading-[1.2] tracking-tight sm:leading-[1.15] md:text-4xl md:leading-[1.1] lg:text-5xl xl:text-6xl 2xl:text-7xl"
          }
        >
          Building video players was never meant to be hard.
        </h1>
        <div className={"mx-auto mt-6 max-w-2xl"}>
          <h2
            className={
              "font-medium text-lg text-neutral-900 sm:text-xl md:text-2xl"
            }
          >
            Modern UI Library for building video players
          </h2>
          <p
            className={
              "font-medium text-neutral-700 text-sm leading-relaxed sm:text-base md:text-lg"
            }
          >
            Powered by&nbsp;
            <Icons.shaka />
            &nbsp;
            <Link
              className={
                "underline underline-offset-2 transition-colors hover:text-neutral-900"
              }
              href={"https://github.com/shaka-project/shaka-player/"}
              rel="noopener noreferrer"
              target="_blank"
            >
              shaka-player
            </Link>
            &nbsp;and&nbsp;
            <Icons.shadcn />
            <Link
              className={
                "underline underline-offset-2 transition-colors hover:text-neutral-900"
              }
              href={"https://ui.shadcn.com/"}
              rel="noopener noreferrer"
              target="_blank"
            >
              shadcn/ui
            </Link>
          </p>
        </div>
      </div>
      {/* </AnimatedGroup> */}
      {/* <AnimatedGroup preset="fade"> */}
      <AnimatedButtons />
      {/* </AnimatedGroup> */}
    </div>
  );
}
