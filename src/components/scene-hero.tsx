import type { ReactNode } from "react";
import Link from "next/link";

interface SceneHeroProps {
  countdownLabel: string;
  meetLabel: string;
  treeCount: number;
  completedMeetCount: number;
}

interface SurfacePlacement {
  left: string;
  top: string;
  scale: number;
  z: number;
  tilt: number;
}

const stars = [
  { top: "6%", left: "10%", delay: "0s", size: 7 },
  { top: "10%", left: "24%", delay: "1.3s", size: 4 },
  { top: "8%", left: "38%", delay: "2.1s", size: 5 },
  { top: "12%", left: "52%", delay: "0.6s", size: 4 },
  { top: "9%", left: "68%", delay: "1.8s", size: 6 },
  { top: "14%", left: "82%", delay: "2.7s", size: 5 },
  { top: "24%", left: "12%", delay: "0.5s", size: 4 },
  { top: "30%", left: "26%", delay: "1.2s", size: 5 },
  { top: "28%", left: "74%", delay: "1.6s", size: 5 },
  { top: "35%", left: "88%", delay: "0.9s", size: 4 },
  { top: "42%", left: "8%", delay: "2.4s", size: 4 },
  { top: "38%", left: "62%", delay: "0.8s", size: 4 },
];

function projectToSphere(longitude: number, latitude: number): SurfacePlacement {
  const lon = (longitude * Math.PI) / 180;
  const lat = (latitude * Math.PI) / 180;
  const x = Math.sin(lon) * Math.cos(lat);
  const y = -Math.sin(lat);
  const z = Math.cos(lon) * Math.cos(lat);

  return {
    left: `${50 + x * 34}%`,
    top: `${51 + y * 32}%`,
    scale: 0.72 + z * 0.34,
    z,
    tilt: longitude * 0.16,
  };
}

function getTreePlacements(treeCount: number): SurfacePlacement[] {
  return Array.from({ length: treeCount }, (_, index) => {
    const longitude = -62 + index * (124 / Math.max(treeCount - 1, 1));
    const latitude = 16 + (index % 3) * 7;
    return projectToSphere(longitude, latitude);
  });
}

function OrbitBadge({
  className,
  title,
  value,
  href,
}: {
  className: string;
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <p className="text-[10px] uppercase tracking-[0.34em] text-starlight/52">{title}</p>
      <p className="mt-1 text-sm font-medium text-starlight sm:text-base">{value}</p>
    </>
  );
  const baseClass = `absolute rounded-full border border-white/42 bg-[rgba(255,251,251,0.74)] px-4 py-3 text-center shadow-[0_16px_40px_rgba(176,138,170,0.2)] backdrop-blur-md ${className}`;

  if (href) {
    return (
      <Link href={href} className={`${baseClass} transition hover:-translate-y-0.5 hover:bg-white/90`}>
        {content}
      </Link>
    );
  }
  return <div className={baseClass}>{content}</div>;
}

function SurfaceItem({
  placement,
  className,
  children,
  lift = 100,
}: {
  placement: SurfacePlacement;
  className?: string;
  children: ReactNode;
  lift?: number;
}) {
  return (
    <div
      className={`absolute ${className ?? ""}`}
      style={{
        left: placement.left,
        top: placement.top,
        zIndex: Math.round(placement.z * 100),
        opacity: 0.72 + placement.z * 0.28,
        transform: `translate(-50%, -${lift}%) scale(${placement.scale}) rotate(${placement.tilt}deg)`,
      }}
    >
      {children}
    </div>
  );
}

function PlanetTree({ scale }: { scale: number }) {
  return (
    <div className="h-20 w-12 animate-float" style={{ transform: `translateX(-50%) scale(${scale})` }}>
      <svg viewBox="0 0 60 92" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-[0_10px_16px_rgba(109,96,139,0.22)]">
        <path d="M30 52L28 88" stroke="#7F5F8B" strokeWidth="4" strokeLinecap="round" />
        <path d="M29 12C18 13 11 23 15 34C8 38 7 50 16 56C14 67 22 74 32 72C39 79 51 77 54 66C61 59 59 45 49 40C51 27 42 13 29 12Z" fill="#89D0B4" />
        <path d="M21 35C28 31 35 25 40 18" stroke="rgba(255,255,255,0.34)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Squirrel() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-[0_12px_16px_rgba(134,97,72,0.18)]">
      <path d="M65 84C86 84 88 61 82 45C77 29 62 22 54 34C61 43 60 56 49 63C50 75 56 84 65 84Z" fill="#D59A72" />
      <path d="M59 79C74 78 76 59 71 47C67 36 57 32 51 39C56 46 55 55 47 61C49 72 53 79 59 79Z" fill="#EDB68F" />
      <ellipse cx="41" cy="67" rx="17" ry="19" fill="#D59A72" />
      <ellipse cx="37" cy="69" rx="9" ry="12" fill="#F8DDC5" />
      <circle cx="35" cy="41" r="14" fill="#D59A72" />
      <path d="M26 34L22 19L34 28" fill="#D59A72" />
      <path d="M41 32L47 18L48 30" fill="#D59A72" />
      <circle cx="31" cy="39" r="2.4" fill="#2D2236" />
      <circle cx="22" cy="44" r="1.7" fill="#2D2236" />
      <path d="M41 55C34 55 27 59 23 64" stroke="#BC8660" strokeWidth="4" strokeLinecap="round" />
      <path d="M49 81L34 86" stroke="#BC8660" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function BluePony() {
  return (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-[0_14px_18px_rgba(119,132,186,0.2)]">
      <path d="M49 70C61 55 87 53 106 62L114 91H100L91 73H61L52 91H38L43 76" fill="#AAC0FF" />
      <circle cx="111" cy="40" r="22" fill="#AAC0FF" />
      <ellipse cx="132" cy="46" rx="16" ry="12" fill="#C8D6FF" />
      <path d="M94 31C88 39 86 49 91 59" stroke="#7186DB" strokeWidth="8" strokeLinecap="round" />
      <path d="M50 70C36 76 30 86 35 96" stroke="#7186DB" strokeWidth="9" strokeLinecap="round" />
      <path d="M97 22L90 5L104 16" fill="#AAC0FF" />
      <circle cx="115" cy="38" r="3.5" fill="#2D2236" />
      <path d="M69 91V111" stroke="#88A0EE" strokeWidth="7" strokeLinecap="round" />
      <path d="M93 91V111" stroke="#88A0EE" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

function CoupleIllustration() {
  return (
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-[0_12px_18px_rgba(128,98,141,0.18)]">
      {/* 女生 */}
      <g>
        {/* 头发 */}
        <path d="M48 38C48 24 58 18 66 18C74 18 84 24 84 40C84 56 80 62 80 72C78 66 72 66 70 72C66 62 62 60 54 58C48 56 48 50 48 38Z" fill="#1B1117" />
        {/* 马尾 */}
        <path d="M80 34C94 36 96 52 90 66C86 58 82 52 80 48Z" fill="#1B1117" />
        {/* 蝴蝶结 */}
        <path d="M74 20L70 14L76 18L82 14L78 20Z" fill="#FFFFFF" />
        {/* 脸 */}
        <circle cx="66" cy="42" r="12" fill="#F6D5C4" />
        {/* 裙子 */}
        <path d="M54 58L48 130L84 130L78 58Z" fill="#FBF3EA" />
      </g>
      {/* 男生 */}
      <g>
        {/* 头发 */}
        <path d="M94 40C94 26 104 20 112 20C122 20 130 28 130 42C128 40 124 38 118 38C110 38 102 42 98 46C96 44 94 42 94 40Z" fill="#1C1218" />
        {/* 脸 */}
        <circle cx="112" cy="44" r="11" fill="#EEC3B2" />
        {/* 衬衫 */}
        <path d="M100 58L98 108L126 108L124 58Z" fill="#FFFFFF" />
        {/* 裤子 */}
        <path d="M100 108L98 150L110 150L112 118L114 150L126 150L124 108Z" fill="#17131A" />
      </g>
    </svg>
  );
}

export function SceneHero({
  countdownLabel,
  meetLabel,
  treeCount,
  completedMeetCount,
}: SceneHeroProps) {
  const treePlacements = getTreePlacements(treeCount);
  const mainPlacements = [
    {
      key: "squirrel",
      placement: projectToSphere(-38, 14),
      node: (
        <div className="h-16 w-16 sm:h-24 sm:w-24">
          <Squirrel />
        </div>
      ),
      lift: 84,
    },
    {
      key: "couple",
      placement: projectToSphere(4, 20),
      node: (
        <div className="h-40 w-[132px] sm:h-56 sm:w-[248px]">
          <CoupleIllustration />
        </div>
      ),
      lift: 84,
    },
    {
      key: "pony",
      placement: projectToSphere(42, 13),
      node: (
        <div className="h-20 w-24 sm:h-28 sm:w-36">
          <BluePony />
        </div>
      ),
      lift: 82,
    },
  ].sort((a, b) => a.placement.z - b.placement.z);

  return (
    <div className="relative w-full max-w-[1240px] overflow-hidden rounded-[42px]">
      <div className="relative min-h-[780px] overflow-hidden rounded-[42px] md:min-h-[880px]">
        <div className="absolute inset-0 rounded-[42px] bg-[radial-gradient(circle_at_50%_10%,rgba(255,250,242,0.95),transparent_15%),radial-gradient(circle_at_16%_18%,rgba(248,211,223,0.72),transparent_28%),radial-gradient(circle_at_84%_24%,rgba(235,196,228,0.44),transparent_26%),radial-gradient(circle_at_50%_92%,rgba(195,189,243,0.54),transparent_32%),linear-gradient(180deg,#f8ece7_0%,#f4dce5_42%,#e5d5ec_72%,#d5d4ef_100%)]" />
        <div className="absolute inset-0 rounded-[42px] bg-[radial-gradient(circle_at_20%_68%,rgba(255,255,255,0.3),transparent_18%),radial-gradient(circle_at_76%_72%,rgba(234,211,255,0.24),transparent_20%)]" />
        <div className="absolute left-1/2 top-[8%] h-28 w-28 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,252,241,1),rgba(255,245,230,0.56)_42%,transparent_76%)] blur-sm sm:h-36 sm:w-36" />
        <div className="absolute left-[12%] top-[26%] h-40 w-40 rounded-full bg-[#f6cadb]/50 blur-3xl" />
        <div className="absolute right-[9%] top-[30%] h-44 w-44 rounded-full bg-[#d7c9f4]/42 blur-3xl" />

        {stars.map((star, index) => (
          <span
            key={index}
            className="absolute animate-twinkle rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.86)]"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
            }}
          />
        ))}

        <span className="absolute left-[14%] top-[34%] h-3 w-3 rotate-45 animate-twinkle bg-white/90 shadow-[0_0_16px_rgba(255,255,255,0.82)]" />
        <span className="absolute right-[16%] top-[40%] h-4 w-4 rotate-45 animate-twinkle bg-[#fff8fb] shadow-[0_0_18px_rgba(255,248,251,0.86)] [animation-delay:1.6s]" />
        <span className="absolute left-[74%] top-[16%] h-2.5 w-2.5 rotate-45 animate-twinkle bg-[#fffef6] shadow-[0_0_12px_rgba(255,248,232,0.84)] [animation-delay:0.7s]" />

        <OrbitBadge className="left-4 top-6 w-[164px] sm:left-8 sm:w-[198px]" title="累计见面" value={`${completedMeetCount} 次`} href="/meet" />
        <OrbitBadge className="right-4 top-10 w-[184px] sm:right-8 sm:w-[228px]" title="星球树木" value={`已经长到 ${treeCount} 棵`} href="/meet" />
        <OrbitBadge className="left-1/2 top-[12%] w-[220px] -translate-x-1/2 sm:w-[300px]" title="下次见面" value={countdownLabel} />

        <div className="absolute inset-x-0 top-[23%] flex justify-center sm:top-[17%]">
          <div className="relative aspect-square w-[min(82vw,820px)] sm:w-[min(94vw,820px)]">
            <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(247,195,222,0.5),rgba(224,208,247,0.24)_48%,transparent_74%)] blur-3xl" />
            <div className="absolute left-[7%] right-[7%] top-[47%] h-[16%] rounded-full border border-white/35 opacity-36" />
            <div className="absolute left-[5%] right-[5%] top-[50%] h-[18%] rounded-full border border-white/22 opacity-22" />

            <div className="absolute inset-[14%]">
              <div className="absolute inset-0 rounded-full border border-white/34 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))] shadow-[0_28px_80px_rgba(202,159,198,0.22)]" />
              <div className="absolute inset-[1.8%] overflow-hidden rounded-full border border-white/24 bg-[radial-gradient(circle_at_28%_24%,#fffaf6_0%,#f7d2e6_10%,#ef9fe2_28%,#c58fff_52%,#aab8ff_76%,#84a0ef_100%)] shadow-[inset_-56px_-76px_120px_rgba(124,111,176,0.38),inset_18px_16px_46px_rgba(255,255,255,0.38)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.98),transparent_18%),radial-gradient(circle_at_44%_38%,rgba(255,236,245,0.4),transparent_18%),radial-gradient(circle_at_74%_68%,rgba(155,165,239,0.38),transparent_28%)]" />
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute inset-y-[-6%] left-0 w-[200%] opacity-100 [animation:planetSurfaceRotate_18s_linear_infinite]">
                    <div className="absolute left-[1%] top-[18%] h-[24%] w-[25%] rounded-full bg-[linear-gradient(180deg,rgba(255,252,250,0.92),rgba(255,224,238,0.5))] blur-sm" />
                    <div className="absolute left-[16%] top-[26%] h-[24%] w-[18%] rounded-[42%] bg-[linear-gradient(180deg,rgba(255,234,244,0.84),rgba(231,217,255,0.42))] blur-sm" />
                    <div className="absolute left-[28%] bottom-[18%] h-[26%] w-[24%] rounded-[46%] bg-[linear-gradient(180deg,rgba(209,236,220,0.42),rgba(148,176,246,0.32))] blur-md" />
                    <div className="absolute left-[44%] bottom-[15%] h-[20%] w-[15%] rounded-[44%] bg-[linear-gradient(180deg,rgba(255,236,247,0.46),rgba(149,171,236,0.38))] blur-md" />
                    <div className="absolute left-[51%] top-[18%] h-[24%] w-[25%] rounded-full bg-[linear-gradient(180deg,rgba(255,252,250,0.92),rgba(255,224,238,0.5))] blur-sm" />
                    <div className="absolute left-[66%] top-[26%] h-[24%] w-[18%] rounded-[42%] bg-[linear-gradient(180deg,rgba(255,234,244,0.84),rgba(231,217,255,0.42))] blur-sm" />
                    <div className="absolute left-[78%] bottom-[18%] h-[26%] w-[24%] rounded-[46%] bg-[linear-gradient(180deg,rgba(209,236,220,0.42),rgba(148,176,246,0.32))] blur-md" />
                    <div className="absolute left-[94%] bottom-[15%] h-[20%] w-[15%] rounded-[44%] bg-[linear-gradient(180deg,rgba(255,236,247,0.46),rgba(149,171,236,0.38))] blur-md" />
                  </div>
                </div>
                <div className="absolute inset-[5%] rounded-full border border-white/20 opacity-72" />
                <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle_at_52%_18%,rgba(255,255,255,0.3),transparent_22%),radial-gradient(circle_at_28%_62%,rgba(255,216,236,0.22),transparent_18%),radial-gradient(circle_at_72%_56%,rgba(177,208,255,0.22),transparent_18%)] blur-sm" />
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_72%_74%,rgba(90,88,150,0.34),transparent_34%),radial-gradient(circle_at_80%_76%,rgba(100,92,160,0.18),transparent_48%)]" />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_-14px_34px_rgba(255,255,255,0.08)]" />
              </div>

              <div className="absolute inset-0">
                {treePlacements.map((placement, index) => (
                  <SurfaceItem
                    key={`tree-${index}`}
                    placement={placement}
                    lift={88}
                    className="[animation-delay:0.2s]"
                  >
                    <PlanetTree scale={0.78 + (index % 4) * 0.08} />
                  </SurfaceItem>
                ))}

                {mainPlacements.map((item) => (
                  <SurfaceItem key={item.key} placement={item.placement} lift={item.lift}>
                    {item.node}
                  </SurfaceItem>
                ))}
              </div>
            </div>

            <div className="absolute inset-[8%] rounded-full border border-white/20 opacity-40" />
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 w-[min(92%,760px)] -translate-x-1/2 rounded-full border border-white/36 bg-[rgba(255,250,250,0.74)] px-5 py-4 text-center shadow-[0_18px_40px_rgba(187,151,177,0.2)] backdrop-blur-md">
          <p className="text-[10px] uppercase tracking-[0.34em] text-starlight/54">星球行程</p>
          <p className="mt-1 text-sm font-medium text-starlight sm:text-base">{meetLabel}</p>
        </div>
      </div>
    </div>
  );
}
