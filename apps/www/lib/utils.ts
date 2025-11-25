import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isActive(
  url: string,
  pathname: string,
  nested = true
): boolean {
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  if (pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  return url === pathname || (nested && pathname.startsWith(`${url}/`));
}
