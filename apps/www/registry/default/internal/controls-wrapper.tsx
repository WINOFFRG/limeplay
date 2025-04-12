import React from "react";

export function ControlsWrapper({ children }: React.PropsWithChildren) {
  return (
    <section className="animate-in fade-in-100 relative my-12 w-full bg-gradient-to-br from-gray-100 to-white transition-all duration-500 ease-in-out dark:from-neutral-900 dark:to-neutral-950">
      <div
        className="absolute left-0 top-0 size-full"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "182px",
          opacity: "0.12"
        }}
      ></div>
      <div
        className="mask-exclude absolute left-[calc(var(--offset)/2*-1)] top-0 z-30 h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]"
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
            "linear-gradient(to top,var(--background)var(--fade-stop),transparent),linear-gradient(to bottom,var(--background)var(--fade-stop),transparent),linear-gradient(black,black)"
        }}
      ></div>

      <div
        className="mask-exclude absolute bottom-0 left-[calc(var(--offset)/2*-1)] top-auto z-30 h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]"
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
            "linear-gradient(to top,var(--background)var(--fade-stop),transparent),linear-gradient(to bottom,var(--background)var(--fade-stop),transparent),linear-gradient(black,black)"
        }}
      ></div>

      <div
        className="mask-exclude absolute left-0 top-[calc(var(--offset)/2*-1)] z-30 h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]"
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
            "linear-gradient(to top,var(--background)var(--fade-stop),transparent),linear-gradient(to bottom,var(--background)var(--fade-stop),transparent),linear-gradient(black,black)"
        }}
      ></div>

      <div
        className="mask-exclude absolute left-auto right-0 top-[calc(var(--offset)/2*-1)] z-30 h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]"
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
            "linear-gradient(to top,var(--background)var(--fade-stop),transparent),linear-gradient(to bottom,var(--background)var(--fade-stop),transparent),linear-gradient(black,black)"
        }}
      ></div>
      {children}
    </section>
  );
}
