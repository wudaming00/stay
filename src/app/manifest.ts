import type { MetadataRoute } from "next";

/**
 * PWA manifest. Lets users "install" Stay to their home screen, which
 * matters for the daily-use case (one-tap entry from a hard moment) and
 * for low-end Android devices where the install lowers friction.
 *
 * Branded as "Stay" — public-product stance. DV-safety is preserved by
 * the panic phrase + quick exit + encrypted local storage, not by an
 * incognito home-screen icon.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stay",
    short_name: "Stay",
    description: "An AI for the moments you can't be alone.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#faf7f2",
    theme_color: "#faf7f2",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
