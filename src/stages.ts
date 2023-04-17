export const STAGES = {
  "Channel 1 Coachella Stage": {
    name: "Channel 1 Coachella Stage",
    color: "#6969B3",
    url: "https://www.youtube.com/watch?v=1-3L7Uw5yEs",
  },
  "Channel 2 Outdoor Theatre": {
    name: "Channel 2 Outdoor Theatre",
    color: "#F2C94C",
    url: "https://www.youtube.com/watch?v=3HYVAL-52PM",
  },
  "Channel 3 Sahara": {
    name: "Channel 3 Sahara",
    color: "#F2994A",
    url: "https://www.youtube.com/watch?v=P8T81_n28L4",
  },
  "Channel 4 Mojave": {
    name: "Channel 4 Mojave",
    color: "#6FCF97",
    url: "https://www.youtube.com/watch?v=wbZ9rP74cRE",
  },
  "Channel 5 Gobi": {
    name: "Channel 5 Gobi",
    color: "#EB5757",
    url: "https://www.youtube.com/watch?v=M7tholO-Ob0",
  },
  "Channel 6 Sonora": {
    name: "Channel 6 Sonora",
    color: "#2F80ED",
    url: "https://www.youtube.com/watch?v=9hdFg3rnOXI",
  },
} as const

export type StageName = keyof typeof STAGES
