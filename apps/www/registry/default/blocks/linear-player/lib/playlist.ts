import type shaka from "shaka-player"

export interface DemoAsset {
  title: string
  description?: string
  poster: string
  src: string
  config?: shaka.extern.PlayerConfiguration
}

export const ASSETS: DemoAsset[] = [
  {
    title: "Blender Foundation - Sintel",
    description:
      "A Blender Foundation short film, protected by Widevine encryption",
    poster: "https://storage.googleapis.com/shaka-asset-icons/sintel.png",
    src: "https://storage.googleapis.com/shaka-demo-assets/sintel-widevine/dash.mpd",
    config: {
      drm: {
        servers: {
          "com.widevine.alpha": "https://cwip-shaka-proxy.appspot.com/no_auth",
        },
        advanced: {
          "com.widevine.alpha": {
            serverCertificateUri:
              "https://cwip-shaka-proxy.appspot.com/service-cert",
          },
        },
      } as unknown as shaka.extern.DrmConfiguration,
    } as shaka.extern.PlayerConfiguration,
  },
  {
    title: "Sing 2 Trailer",
    description: "Media Tailor HLS Stream",
    poster: "https://storage.googleapis.com/shaka-asset-icons/sing.png",
    src: "https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/master/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8",
  },
  {
    title: "Big Buck Bunny",
    description: "A Blender Foundation short film, Media Tailor Live DASH",
    poster:
      "https://storage.googleapis.com/shaka-asset-icons/big_buck_bunny.png",
    src: "https://d305rncpy6ne2q.cloudfront.net/v1/dash/94063eadf7d8c56e9e2edd84fdf897826a70d0df/SFP-MediaTailor-Live-HLS-DASH/channel/sfp-channel1/dash.mpd",
  },
  {
    title: "National Geographic - VR equirectangular",
    description: "HLS Video",
    poster: "https://demo.theoplayer.com/hubfs/videos/natgeo/poster.jpg",
    src: "https://demo.theoplayer.com/hubfs/videos/natgeo/playlist.m3u8",
  },
]
