import { STAGES, type StageName } from "@/stages"
import type { Performance, TimeTableData } from "@/timetables"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"


const WEEKS = ["1", "2"] as const
export type Week = (typeof WEEKS)[number]

type TimeTableProps<T> = {
  timetable: { [channel: string]: Performance[] }
  week: T
}


function isStageName<T extends Week>(name: string, week: T): name is StageName<T> {
  return name in STAGES[week]
}

const getStages = (week: Week): StageName<Week>[] => {
  return Object.keys(STAGES[week]) as StageName<Week>[]
}

const TimeTable = <T extends Week>({ timetable, week }: TimeTableProps<T>) => {
  const calculateEndTime = (start: string, end?: string): string => {
    if (end) {
      return end
    } else {
      const [startHour, startMinute] = start.split(":")
      const endTime = `${parseInt(startHour) + 1}:${startMinute}`
      return endTime
    }
  }

  const calculatePerformanceLength = (start: string, end?: string): number => {
    if (!end) return 120
    const [startHour, startMinute] = start.split(":")
    const [endHour, endMinute] = calculateEndTime(start, end).split(":")
    const performanceLength =
      (parseInt(endHour) - parseInt(startHour)) * 60 + (parseInt(endMinute) - parseInt(startMinute))
    return performanceLength
  }

  const getTimeRow = (): JSX.Element[] => {
    const timeArray: JSX.Element[] = []
    for (let i = 8; i < 17; i++) {
      timeArray.push(
        <div key={i} className="time-header">
          {i % 12 === 0 ? "12" : i % 12} {i < 12 ? "AM" : "PM"}
        </div>
      )
    }
    return timeArray
  }

  function getPerformanceRow<T extends Week, C extends StageName<T>>(
    channel: C,
    lineup: Performance[],
    week: T
  ): JSX.Element[] {
    const stages = STAGES[week] as { [key in C]: { color: string; url: string } }

    return lineup.map((performance, j) => {
      const hourHeight = 120
      const performanceLength = calculatePerformanceLength(
        performance.start_time,
        performance.end_time
      )
      const performanceHeight = (performanceLength * hourHeight) / 60
      const marginTimeToNextPerformance =
        (calculatePerformanceLength(performance.end_time!, lineup[j + 1]?.start_time) *
          hourHeight) /
        60

      const calculateFontColor = (color: string): string => {
        const [r, g, b] = color.match(/\w\w/g)?.map((x) => parseInt(x, 16)) || [0, 0, 0]
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        return brightness > 125 ? "#000000" : "#ffffff"
      }

      return (
        <a
          key={`${channel}-${j}`}
          className="performance-container"
          href={stages[channel].url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            overflowY: "scroll",
            overflowX: "hidden",
            overflowWrap: "normal",
            height: `${performanceHeight}px`,
            marginBottom: `${marginTimeToNextPerformance}px`,
            backgroundColor: stages[channel].color,
            color: calculateFontColor(stages[channel].color),
            textDecoration: "none",
          }}
        >
          <div className="performance-content">
            {performance.artist === "Frank Ocean" ? (
              <div
                className="artist-name"
                style={{
                  fontSize: "1.8rem",
                  textShadow: "0 0 10px gold",
                }}
              >
                {performance.artist}
              </div>
            ) : performance.artist === "Weyes Blood" ? (
              <div
                className="artist-name"
                style={{
                  color: "darkblue",
                  fontSize: "1.6rem",
                  textShadow: "2px 2px 3px #558ABB",
                }}
              >
                {performance.artist}
              </div>
            ) : performance.artist === "BLACKPINK" ? (
              <div
                className="artist-name"
                style={{
                  fontSize: "1.6rem",
                  textShadow: "2px 2px 10px #ffa6fc",
                }}
              >
                {performance.artist}
              </div>
            ) : (
              <div className="artist-name">{performance.artist}</div>
            )}
            <div className="time" style={{ fontSize: "1.2rem" }}>
              {performance.start_time}-{performance.end_time || ""}
            </div>
            <div className="channel" style={{ fontSize: "1rem" }}>
              {channel}
            </div>
          </div>
        </a>
      )
    })
  }

  return (
    <div className="timetable-container">
      <div className="header-container">
        <div className="empty-header"></div>
        {getTimeRow()}
      </div>
      <div className="performance-container-flex">
        {Object.entries(timetable).map(([channel, lineup], i) => {
          if (!isStageName(channel, week)) return null
          
          const stages = STAGES[week] as { [key in typeof channel]: { color: string } }

          return (
            <div className="channel" key={JSON.stringify(lineup)}>
              <div
                key={`header-${i}`}
                className="channel-header"
                style={{
                  marginBottom: `${
                    lineup.length > 0
                      ? (calculatePerformanceLength("8:00", lineup[0].start_time) * 120) / 60
                      : 0
                  }px`,
                  color: stages[channel].color,
                }}
              >
                {channel}
              </div>
              {getPerformanceRow(channel, lineup, week)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const isValidDay = (day?: string | string[]): day is "1" | "2" | "3" => {
  if (typeof day === "string") {
    return ["1", "2", "3"].includes(day)
  }

  return false
}

const isValidWeek = (week?: string | string[]): week is "1" | "2" => {
  if (typeof week === "string") {
    return ["1", "2"].includes(week)
  }

  return false
}

const getDays = (week: Week) => {
  if (week === "1") {
    return {
      "1": "4/15(土)",
      "2": "4/16(日)",
      "3": "4/17(月)",
    }
  }

  return {
    "1": "4/22(土)",
    "2": "4/23(日)",
    "3": "4/24(月)",
  }
}

type TimeTables = {
  "1": TimeTableData
  "2": TimeTableData
  "3": TimeTableData
}

const getTimeTables = async (week: "1" | "2"): Promise<TimeTables> => {
  const { DAY_1, DAY_2, DAY_3 } =
    week === "1" ? await import("@/timetables") : await import("@/timetables_week2")

  return {
    "1": DAY_1,
    "2": DAY_2,
    "3": DAY_3,
  }
}

export default function Home() {
  const router = useRouter()
  const day = isValidDay(router.query.day) ? router.query.day : null
  const week = isValidWeek(router.query.week) ? router.query.week : null
  const days = getDays(week || "1")

  const [timetables, setTimetables] = useState<TimeTables | null>(null)

  useEffect(() => {
    if (!day && router.isReady) {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          day: "1",
        },
      })
    }

    if (!week && router.isReady) {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          week: "2",
        },
      })
    }
  }, [day, router, week])

  useEffect(() => {
    if (week) {
      getTimeTables(week).then((timetables) => {
        setTimetables(timetables)
      })
    }
  }, [week])

  const timetable = day && timetables ? timetables[day] : null

  return (
    <main className="app-main">
      <Head>
        <title>Coachella2023日本時間タイムテーブル</title>
      </Head>
      <div className="date-selector">
        {Object.entries(days).map(([day, dayName]) => {
          const isSelected = day === router.query.day

          return (
            <div
              key={day}
              className={`day ${isSelected ? "selected" : ""}`}
              style={{
                backgroundColor: isSelected ? "#ffffff" : "#000000",
              }}
            >
              <Link
                href={{
                  pathname: "/",
                  query: {
                    ...router.query,
                    day,
                  },
                }}
                style={{
                  color: isSelected ? "#000000" : "#ffffff",
                  textDecoration: "none",
                }}
              >
                {dayName}
              </Link>
            </div>
          )
        })}
        <Link
          className="week-toggle"
          href={{
            pathname: "/",
            query: {
              ...router.query,
              week: week === "1" ? "2" : "1",
            },
          }}
        >
          WEEK{week} &#128260;
        </Link>
      </div>
      <span className="note">
        ※現地のタイムテーブルなので実際の配信スケジュールとは一部異なります。
        <br />
        リプレイ等は余裕があったら追加します。各チャンネル見た方が確実です。
      </span>
      {timetable && week && <TimeTable timetable={timetable} week={week} />}
    </main>
  )
}
