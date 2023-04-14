import { day1, day2, day3 } from '@/timetables';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';



interface Performance {
  start_time: string;
  end_time?: string;
  artist: string;
}

interface TimeTableProps {
  timetable: { [channel: string]: Performance[] };
}

const STAGES: {
  [channel: string]: {
    name: string;
    color: string;
    url?: string;
  };
} = {
  'Channel 1 Coachella Stage': {
    name: 'Channel 1 Coachella Stage',
    color: '#6969B3',
    url: "https://www.youtube.com/watch?v=1-3L7Uw5yEs"
  },
  'Channel 2 Outdoor Theatre': {
    name: 'Channel 2 Outdoor Theatre',
    color: '#F2C94C',
    url: "https://www.youtube.com/watch?v=3HYVAL-52PM"
  },
  'Channel 3 Sahara': {
    name: 'Channel 3 Sahara',
    color: '#F2994A',
    url: "https://www.youtube.com/watch?v=P8T81_n28L4"
  },
  'Channel 4 Mojave': {
    name: 'Channel 4 Mojave',
    color: '#6FCF97',
    url: "https://www.youtube.com/watch?v=wbZ9rP74cRE"
  },
  'Channel 5 Gobi': {
    name: 'Channel 5 Gobi',
    color: '#EB5757',
    url: "https://www.youtube.com/watch?v=M7tholO-Ob0"
  },
  'Channel 6 Sonora': {
    name: 'Channel 6 Sonora',
    color: '#2F80ED',
    url: "https://www.youtube.com/watch?v=9hdFg3rnOXI"
  }
}

const TimeTable: React.FC<TimeTableProps> = ({ timetable }) => {
  const calculateEndTime = (start: string, end?: string): string => {
    if (end) {
      return end;
    } else {
      const [startHour, startMinute] = start.split(':');
      const endTime = `${parseInt(startHour) + 1}:${startMinute}`;
      return endTime;
    }
  };

  const calculatePerformanceLength = (start: string, end?: string): number => {
    if (!end) return 120;
    const [startHour, startMinute] = start.split(':');
    const [endHour, endMinute] = calculateEndTime(start, end).split(':');
    const performanceLength = (parseInt(endHour) - parseInt(startHour)) * 60 + (parseInt(endMinute) - parseInt(startMinute));
    return performanceLength;
  };

  const getTimeRow = (): JSX.Element[] => {
    const timeArray: JSX.Element[] = [];
    for (let i = 4; i < 17; i++) {
      timeArray.push(
        <div key={i} className="time-header">
          {i % 12 === 0 ? '12' : i % 12} {i < 12 ? 'AM' : 'PM'}
        </div>
      );
    }
    return timeArray;
  };

  const getPerformanceRow = (channel: string, lineup: Performance[]): JSX.Element[] => {
    return lineup.map((performance, j) => {
      const hourHeight = 120
      const performanceLength = calculatePerformanceLength(performance.start_time, performance.end_time);
      const performanceHeight = performanceLength * hourHeight / 60;
      const marginTimeToNextPerformance = calculatePerformanceLength(performance.end_time!, lineup[j + 1]?.start_time) * hourHeight / 60;

      const calculateFontColor = (color: string): string => {
        const [r, g, b] = color.match(/\w\w/g)?.map((x) => parseInt(x, 16)) || [
          0,
          0,
          0,
        ];
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 125 ? '#000000' : '#ffffff';
      };

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
            marginBottom: `${(marginTimeToNextPerformance)}px`,
            backgroundColor: STAGES[channel].color,color: calculateFontColor(STAGES[channel].color), textDecoration: 'none'
          }}
        >
          <div className="performance-content">
            {performance.artist === "Frank Ocean" 
            ? (
              <div className="artist-name"
                style={{
                  fontSize: "1.8rem",
                  textShadow: "0 0 10px gold",
                }}
              >
                {performance.artist}
              </div>
            )
            : (
              <div className="artist-name">{performance.artist}</div>
            )}
            <div className="time"
              style={{ fontSize: "1.2rem" }}
            >{performance.start_time}-{performance.end_time || ''}</div>
            <div className="channel"
              style={{ fontSize: "1rem" }}
            >{channel}</div>
          </div>
        </a>
      );
    });
  };


  return (
    <div className="timetable-container">
      <div className="header-container">
        <div className="empty-header"></div>
        {getTimeRow()}
      </div>
      <div className="performance-container-flex">
        {Object.entries(timetable).map(([channel, lineup], i) => 
          <div className="channel" key={JSON.stringify(lineup)}>
            <div key={`header-${i}`} className="channel-header"
              style={{
                marginBottom: `${lineup.length > 0 ? calculatePerformanceLength('4:00', lineup[0].start_time) * 120 / 60 : 0}px`,
                color: STAGES[channel].color
              }}
            >
              {channel}
            </div>
            {getPerformanceRow(channel, lineup)}
          </div>
          )}
      </div>
    </div>
  );
};


export default function Home() {
  const router = useRouter();
  const day = router.query.day as '1';

  const days = {
    '1': '4/15(土)',
    '2': '4/16(日)',
    '3': '4/17(月)',
  }

  const timetables = {
    '1': day1,
    '2': day2,
    '3': day3,
  }

  useEffect(() => {
    if (!day && router.isReady) {
      router.replace("?day=1");
    }
  }, [day, router]);
  
  const timetable  = timetables[day!]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Head>
        <title>Coachella2023日本時間タイムテーブル</title>
      </Head>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
          padding: '1rem',
        }}
      >
        {Object.entries(days).map(([day, dayName]) => {
          return (
            <div key={day}
              className={`day ${day === router.query.day ? 'selected' : ''}`}
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginRight: '1rem',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 0 0 1px #ffffff',
                backgroundColor: day === router.query.day ? '#ffffff' : '#000000',
              }}
            >
              <Link href={`?day=${day}`}
                style={{
                  color: day === router.query.day ? '#000000' : '#ffffff',
                  textDecoration: 'none',
                }}
              >{dayName}</Link>
            </div>
          )
        })}
      </div>
      {day && (
        <TimeTable timetable={timetable} />
      )}
    </main>
  )
}
