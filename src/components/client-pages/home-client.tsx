"use client";

import { useEffect, useMemo, useState } from "react";
import { SceneHero } from "@/components/scene-hero";
import { useCollection } from "@/hooks/use-collection";
import { countdownParts, formatDate } from "@/lib/utils";
import type { MeetPlan } from "@/lib/types";

export function HomeClient() {
  const { data: meets } = useCollection<MeetPlan>("meet_plans", "meet_plans");
  const [countdown, setCountdown] = useState(countdownParts(undefined));

  const nextMeet = useMemo(
    () => meets.find((item) => item.status !== "已完成") ?? meets[0],
    [meets],
  );
  const completedMeetCount = useMemo(
    () => meets.filter((item) => item.status === "已完成").length,
    [meets],
  );
  const treeCount = 5 + completedMeetCount;

  useEffect(() => {
    const update = () => setCountdown(countdownParts(nextMeet?.next_date));
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, [nextMeet?.next_date]);

  return (
    <section className="animate-fadeIn flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <SceneHero
        countdownLabel={`${countdown.days} 天 ${countdown.hours} 时 ${countdown.minutes} 分`}
        meetLabel={
          nextMeet
            ? `${formatDate(nextMeet.next_date)} · ${nextMeet.location} · ${nextMeet.role}`
            : "把下一次见面轻轻写进星球里"
        }
        treeCount={treeCount}
        completedMeetCount={completedMeetCount}
      />
    </section>
  );
}
