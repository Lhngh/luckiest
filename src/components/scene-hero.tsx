const stars = [
  { top: "10%", left: "6%", delay: "0s", size: 7 },
  { top: "18%", left: "18%", delay: "1.2s", size: 6 },
  { top: "13%", left: "37%", delay: "2.2s", size: 9 },
  { top: "21%", left: "53%", delay: "0.8s", size: 5 },
  { top: "11%", left: "68%", delay: "1.9s", size: 7 },
  { top: "26%", left: "82%", delay: "2.8s", size: 8 },
  { top: "32%", left: "28%", delay: "0.4s", size: 5 },
  { top: "36%", left: "60%", delay: "2.4s", size: 6 },
  { top: "42%", left: "10%", delay: "1.4s", size: 4 },
  { top: "48%", left: "88%", delay: "3.1s", size: 5 },
];

export function SceneHero() {
  return (
    <div className="relative aspect-[21/9] overflow-hidden rounded-[40px] border border-white/20 bg-[linear-gradient(180deg,#15254d_0%,#0f1933_50%,#102241_100%)] shadow-paper">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(244,240,216,0.35),transparent_18%),radial-gradient(circle_at_52%_18%,rgba(255,217,135,0.14),transparent_28%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(180deg,transparent_0%,rgba(19,31,55,0.16)_18%,rgba(29,50,76,0.95)_100%)]" />
      <div className="absolute inset-x-0 bottom-[15%] h-[18%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,232,179,0.28),transparent_36%),linear-gradient(180deg,rgba(72,108,160,0.18),rgba(34,57,84,0.7))] blur-[1px]" />
      <div className="absolute inset-x-[12%] bottom-[13%] h-[10%] rounded-full bg-[radial-gradient(circle,rgba(255,240,197,0.42),rgba(255,240,197,0.05)_48%,transparent_70%)] blur-xl" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="absolute animate-twinkle rounded-full bg-starlight shadow-[0_0_12px_rgba(255,245,205,0.65)]"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
          }}
        />
      ))}

      <div className="absolute inset-x-0 bottom-[8%] mx-auto flex w-[34%] min-w-[220px] items-end justify-center gap-5">
        <div className="relative h-40 w-20 animate-float [animation-delay:0.2s]">
          <div className="absolute left-1/2 top-0 h-10 w-10 -translate-x-1/2 rounded-full bg-[#f6d9ba] shadow-[0_0_0_6px_rgba(18,28,45,0.3)]" />
          <div className="absolute left-1/2 top-1 h-12 w-12 -translate-x-1/2 rounded-full bg-[#151920]" />
          <div className="absolute left-1/2 top-8 h-14 w-6 -translate-x-1/2 rounded-full bg-[#151920]" />
          <div className="absolute left-1/2 top-11 h-16 w-14 -translate-x-1/2 rounded-[18px] bg-[#2f5d9b]" />
          <div className="absolute left-1/2 top-20 h-20 w-16 -translate-x-1/2 rounded-[18px] bg-[#214675]" />
        </div>
        <div className="relative h-36 w-20 animate-float [animation-delay:0.7s]">
          <div className="absolute left-1/2 top-0 h-10 w-10 -translate-x-1/2 rounded-full bg-[#f1d1b1] shadow-[0_0_0_6px_rgba(18,28,45,0.25)]" />
          <div className="absolute left-1/2 top-2 h-7 w-11 -translate-x-1/2 rounded-full bg-[#382821]" />
          <div className="absolute left-1/2 top-11 h-16 w-14 -translate-x-1/2 rounded-[18px] bg-[#faf6ef]" />
          <div className="absolute left-1/2 top-[5.5rem] h-16 w-16 -translate-x-1/2 rounded-[18px] bg-[#52658b]" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(circle_at_50%_0%,rgba(255,232,179,0.32),transparent_38%),linear-gradient(180deg,rgba(50,73,96,0),rgba(17,30,49,0.86)_60%,rgba(9,14,24,0.98)_100%)]" />
      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-tr-[80px] bg-[linear-gradient(180deg,rgba(14,28,48,0),rgba(8,15,24,0.95))]" />
      <div className="absolute bottom-0 right-0 h-40 w-40 rounded-tl-[80px] bg-[linear-gradient(180deg,rgba(14,28,48,0),rgba(8,15,24,0.95))]" />
    </div>
  );
}
