import { Week } from "./pages"

export const STAGES_WEEK1 = {
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

export const STAGES_WEEK2 = {
  "Channel 1 Coachella Stage": {
    name: "Channel 1 Coachella Stage",
    color: "#6969B3",
    // url: "https://www.youtube.com/watch?v=1-3L7Uw5yEs",
    url: "https://www.youtube.com/watch?v=3ti6RRk-OVQ",
  },
  "Channel 2 Outdoor Theatre": {
    name: "Channel 2 Outdoor Theatre",
    color: "#F2C94C",
    // url: "https://www.youtube.com/watch?v=3HYVAL-52PM",
    url: "https://www.youtube.com/watch?v=3C57SwK9QvY",
  },
  "Channel 3 Sahara": {
    name: "Channel 3 Sahara",
    color: "#F2994A",
    // url: "https://www.youtube.com/watch?v=P8T81_n28L4",
    url: "https://www.youtube.com/watch?v=o7q7ahC5eMI",
  },
  "Channel 4 Mojave": {
    name: "Channel 4 Mojave",
    color: "#6FCF97",
    url: "https://www.youtube.com/watch?v=dZgeMO52kvg",
  },
  "Channel 5 Gobi": {
    name: "Channel 5 Gobi",
    color: "#EB5757",
    url: "https://www.youtube.com/watch?v=7Zv5aSik3Fk",
  },
  "Channel 6 Yuma": {
    name: "Channel 6 Sonora",
    color: "#2F80ED",
    url: "https://www.youtube.com/watch?v=RzFS36bQvv0",
  },
} as const

export type StageNameWeek2 = keyof typeof STAGES_WEEK2

export type StageNameWeek1 = keyof typeof STAGES_WEEK1

export const STAGES: {
  [key in Week]: typeof STAGES_WEEK1 | typeof STAGES_WEEK2
} = {
  "1": STAGES_WEEK1,
  "2": STAGES_WEEK2,
}

export type StageName<T extends "1" | "2"> = T extends "1" ? StageNameWeek1 : StageNameWeek2
