import { STAGES, type StageName } from "@/stages"
import { DAY_1, DAY_2, DAY_3, type Performance } from "@/timetables"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect } from "react"

type TimeTableProps = {
  timetable: { [channel: string]: Performance[] }
}

const isStageName = (name: string): name is StageName => {
  return name in STAGES
}

const TimeTable: React.FC<TimeTableProps> = ({ timetable }) => {
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

  const getPerformanceRow = (channel: StageName, lineup: Performance[]): JSX.Element[] => {
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
          href={STAGES[channel].url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            overflowY: "scroll",
            overflowX: "hidden",
            overflowWrap: "normal",
            height: `${performanceHeight}px`,
            marginBottom: `${marginTimeToNextPerformance}px`,
            backgroundColor: STAGES[channel].color,
            color: calculateFontColor(STAGES[channel].color),
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
          if (!isStageName(channel)) return null

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
                  color: STAGES[channel].color,
                }}
              >
                {channel}
              </div>
              {getPerformanceRow(channel, lineup)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const day = router.query.day as "1"

  const days = {
    "1": "4/15(土)",
    "2": "4/16(日)",
    "3": "4/17(月)",
  }

  const timetables = {
    "1": DAY_1,
    "2": DAY_2,
    "3": DAY_3,
  }

  useEffect(() => {
    if (!day && router.isReady) {
      router.replace("?day=1")
    }
  }, [day, router])

  const timetable = timetables[day!]

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
                href={`?day=${day}`}
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
      </div>
      <span className="note">
        ※現地のタイムテーブルなので実際の配信スケジュールとは一部異なります。
        <br />
        （8:30amくらいからliveになるっぽいです）
      </span>
      {day && <TimeTable timetable={timetable} />}
    </main>
  )
}
