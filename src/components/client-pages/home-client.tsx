"use client";

import { useEffect, useMemo, useState } from "react";
import { SceneHero } from "@/components/scene-hero";
import { SummaryCard } from "@/components/summary-card";
import { PaperCard } from "@/components/paper-card";
import { useCollection } from "@/hooks/use-collection";
import { countdownParts, formatDate } from "@/lib/utils";
import type { BookPlan, EnjoyPlan, MeetPlan } from "@/lib/types";

export function HomeClient() {
  const { data: meets } = useCollection<MeetPlan>("meet_plans", "meet_plans");
  const { data: books } = useCollection<BookPlan>("book_plans", "book_plans");
  const { data: enjoys } = useCollection<EnjoyPlan>("enjoy_plans", "enjoy_plans");
  const [countdown, setCountdown] = useState(countdownParts(undefined));

  const nextMeet = useMemo(
    () => meets.find((item) => item.status !== "已完成") ?? meets[0],
    [meets],
  );
  const currentBook = useMemo(
    () => books.find((item) => item.status !== "已归档") ?? books[0],
    [books],
  );
  const currentEnjoy = useMemo(() => enjoys[0], [enjoys]);

  useEffect(() => {
    const update = () => setCountdown(countdownParts(nextMeet?.next_date));
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, [nextMeet?.next_date]);

  return (
    <div className="animate-fadeIn space-y-8">
      <section className="space-y-4 text-center">
        <p className="text-sm tracking-[0.36em] text-starlight/60">星月赴约 · 京沪专属</p>
        <h1 className="font-display text-5xl text-starlight sm:text-6xl">星月赴约</h1>
        <p className="mx-auto max-w-2xl text-base leading-8 text-starlight/74 sm:text-lg">
          京沪相隔，共赴星月。把每一次奔赴、每一页共读、每一场共赏和每一句悄悄话，写进这片温柔夜色里。
        </p>
      </section>

      <SceneHero />

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          eyebrow="下次见面"
          title={`${countdown.days} 天 ${countdown.hours} 时 ${countdown.minutes} 分`}
          description={nextMeet ? `${formatDate(nextMeet.next_date)} · ${nextMeet.location} · ${nextMeet.role}` : "把下一次奔赴先记下来吧"}
          highlight={nextMeet?.status ? `当前状态：${nextMeet.status}` : undefined}
        />
        <SummaryCard
          eyebrow="本月共读"
          title={currentBook?.title ?? "尚未写下书名"}
          description={currentBook ? `${formatDate(currentBook.start_date)} - ${formatDate(currentBook.end_date)} · ${currentBook.status}` : "每月一本，把彼此的感受留在书页边"}
          highlight={currentBook?.cover_url ? "已设置封面链接" : "等待上传一本温柔的封面"}
        />
        <SummaryCard
          eyebrow="本月共赏"
          title={currentEnjoy?.title ?? "挑一场心动演出吧"}
          description={currentEnjoy ? `${currentEnjoy.type} · ${formatDate(currentEnjoy.date)}` : "音乐剧、电影或动画，都适合一起被点亮"}
          highlight={currentEnjoy?.rating ? `双人评分：${currentEnjoy.rating}/10` : "等你们留下第一次评分"}
        />
      </section>

      <PaperCard className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">我们的约定</p>
          <h2 className="mt-3 font-display text-3xl text-starlight">距离有限，爱意无限</h2>
          <p className="mt-4 text-sm leading-8 text-starlight/76">
            在这条铺满细碎星光的小路上，所有记录都保持轻柔流动。页面切换淡入，按钮只轻轻发亮，像月光落在树叶边缘的呼吸。
          </p>
        </div>
        <div className="grid gap-3 text-sm text-starlight/74">
          <div className="rounded-[24px] border border-white/16 bg-white/8 p-4">见面规则：每月一次，轮流往返，长假加更。</div>
          <div className="rounded-[24px] border border-white/16 bg-white/8 p-4">共读节奏：每月一本，摘抄和读后感都能实时同步。</div>
          <div className="rounded-[24px] border border-white/16 bg-white/8 p-4">心愿收纳：把未来旅行、一起做的小事轻轻放在这里。</div>
        </div>
      </PaperCard>
    </div>
  );
}
