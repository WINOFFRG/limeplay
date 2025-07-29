// @ts-nocheck fix css later

import React from "react"

export function CustomDemoControls({ children }: React.PropsWithChildren) {
  return (
    <section
      className={`animate-in to-primary fade-in-100 relative mt-10 flex w-full flex-row bg-gradient-to-br from-gray-100 px-8 py-3 transition-all duration-500 ease-in-out dark:from-neutral-900 dark:to-neutral-950`}
    >
      <div
        className={`absolute top-0 left-[calc(var(--offset)/2*-1)] z-30 h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] mask-exclude dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]`}
        style={{
          ["--background"]: "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": "20px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
          maskImage:
            "linear-gradient(to top,var(--background)var(--fade-stop),transparent),linear-gradient(to bottom,var(--background)var(--fade-stop),transparent),linear-gradient(black,black)",
        }}
      ></div>

      <div
        className={`absolute top-auto bottom-0 left-[calc(var(--offset)/2*-1)] z-30 h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] mask-exclude dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]`}
        style={{
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": "20px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
          maskImage:
            "linear-gradient(to top,var(--background)var(--fade-stop),transparent),linear-gradient(to bottom,var(--background)var(--fade-stop),transparent),linear-gradient(black,black)",
        }}
      ></div>

      <div
        className={`absolute top-[calc(var(--offset)/2*-1)] left-0 z-30 h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] mask-exclude dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]`}
        style={{
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": "40px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
          maskImage:
            "linear-gradient(to top,var(--background)var(--fade-stop),transparent),linear-gradient(to bottom,var(--background)var(--fade-stop),transparent),linear-gradient(black,black)",
        }}
      ></div>

      <div
        className={`absolute top-[calc(var(--offset)/2*-1)] right-0 left-auto z-30 h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] mask-exclude dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]`}
        style={{
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": "40px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
          maskImage:
            "linear-gradient(to top,var(--background)var(--fade-stop),transparent),linear-gradient(to bottom,var(--background)var(--fade-stop),transparent),linear-gradient(black,black)",
        }}
      ></div>
      {children}
    </section>
  )
}
