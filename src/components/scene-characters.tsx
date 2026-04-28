export function SceneCharacters() {
  return (
    <div className="absolute inset-x-0 bottom-[7.5%] mx-auto flex w-full min-w-[240px] items-end justify-center gap-4">
      {/* Blue Pony */}
      <div className="relative h-20 w-16 animate-float [animation-delay:1.1s] -scale-x-100">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 h-full w-full">
          {/* Body */}
          <path d="M 30 60 Q 50 50 70 60 L 75 85 L 65 85 L 60 70 L 40 70 L 35 85 L 25 85 Z" fill="#8fa8ea" />
          {/* Head */}
          <circle cx="75" cy="40" r="18" fill="#8fa8ea" />
          {/* Snout */}
          <ellipse cx="88" cy="45" rx="10" ry="8" fill="#a8bdf0" />
          {/* Ear */}
          <path d="M 65 30 L 60 15 L 70 25 Z" fill="#8fa8ea" />
          {/* Eye */}
          <circle cx="80" cy="38" r="3" fill="#1e151a" />
          {/* Mane/Tail */}
          <path d="M 58 35 Q 50 45 55 55" stroke="#5565a6" strokeWidth="4" strokeLinecap="round" />
          <path d="M 28 60 Q 15 65 20 80" stroke="#5565a6" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Woman */}
      <div className="relative h-44 w-24 animate-float [animation-delay:0.2s]">
        <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 h-full w-full">
          {/* Hair back */}
          <path d="M 30 50 Q 20 90 35 110 Q 25 120 40 130 Q 50 90 60 60 Z" fill="#1e151a" />
          {/* Body/Dress */}
          <path d="M 50 70 L 35 190 L 75 190 L 60 70 Z" fill="#f9f1e8" />
          {/* Dress top detail */}
          <path d="M 42 70 Q 50 85 58 70" fill="#f9f1e8" stroke="#e8dfd5" strokeWidth="2" />
          {/* Head */}
          <circle cx="50" cy="40" r="16" fill="#f4cdb9" />
          {/* Hair front */}
          <path d="M 34 40 Q 50 20 66 40 Q 60 25 40 25 Z" fill="#1e151a" />
          {/* Bow */}
          <path d="M 50 15 L 40 10 L 45 20 Z M 50 15 L 60 10 L 55 20 Z" fill="#ffffff" />
          {/* Arms */}
          <path d="M 40 75 Q 30 110 35 130" stroke="#f4cdb9" strokeWidth="5" strokeLinecap="round" />
          <path d="M 60 75 Q 70 110 65 130" stroke="#f4cdb9" strokeWidth="5" strokeLinecap="round" />
          {/* Face */}
          <circle cx="45" cy="40" r="2" fill="#1e151a" />
          <circle cx="55" cy="40" r="2" fill="#1e151a" />
          <path d="M 48 46 Q 50 48 52 46" stroke="#d98c8c" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Man */}
      <div className="relative h-48 w-28 animate-float [animation-delay:0.75s]">
        <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 h-full w-full">
          {/* Pants */}
          <path d="M 40 110 L 35 190 L 48 190 L 50 130 L 52 190 L 65 190 L 60 110 Z" fill="#141217" />
          {/* Shirt */}
          <path d="M 35 60 L 40 115 L 60 115 L 65 60 Z" fill="#ffffff" />
          {/* Collar */}
          <path d="M 40 60 L 50 75 L 60 60" stroke="#e8dfd5" strokeWidth="2" fill="none" />
          {/* Head */}
          <circle cx="50" cy="35" r="15" fill="#efc4ad" />
          {/* Hair */}
          <path d="M 33 35 Q 40 10 65 25 Q 68 35 65 40 Q 60 20 40 25 Z" fill="#20171b" />
          {/* Arms */}
          <path d="M 35 65 Q 25 100 30 120" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
          <path d="M 65 65 Q 75 100 70 120" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
          <path d="M 30 120 L 28 135" stroke="#efc4ad" strokeWidth="5" strokeLinecap="round" />
          <path d="M 70 120 L 72 135" stroke="#efc4ad" strokeWidth="5" strokeLinecap="round" />
          {/* Face */}
          <circle cx="45" cy="35" r="2" fill="#1e151a" />
          <circle cx="55" cy="35" r="2" fill="#1e151a" />
          <path d="M 48 42 Q 50 44 52 42" stroke="#d98c8c" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Squirrel */}
      <div className="relative h-16 w-16 animate-float [animation-delay:0.4s]">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 h-full w-full">
          {/* Tail */}
          <path d="M 60 80 Q 90 80 80 40 Q 70 20 55 50" fill="#c48a62" />
          <path d="M 65 75 Q 85 75 75 45 Q 68 30 58 52" fill="#d99f77" />
          {/* Body */}
          <ellipse cx="45" cy="65" rx="15" ry="20" fill="#c48a62" />
          {/* Belly */}
          <ellipse cx="40" cy="68" rx="8" ry="14" fill="#f4cdb9" />
          {/* Head */}
          <circle cx="35" cy="40" r="12" fill="#c48a62" />
          {/* Ears */}
          <path d="M 28 32 L 25 20 L 35 28 Z" fill="#c48a62" />
          <path d="M 40 30 L 45 18 L 45 28 Z" fill="#c48a62" />
          {/* Eye */}
          <circle cx="30" cy="38" r="2" fill="#1e151a" />
          {/* Nose */}
          <circle cx="22" cy="42" r="1.5" fill="#1e151a" />
          {/* Arms/Legs */}
          <path d="M 40 55 L 25 60" stroke="#c48a62" strokeWidth="3" strokeLinecap="round" />
          <path d="M 45 80 L 30 85" stroke="#c48a62" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
