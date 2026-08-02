// Simple monochrome line-art / silhouette icons for the about-page stamp
// board. All share a 0 0 48 48 viewBox and inherit color via `currentColor`
// so a single stamp component can drop any of them in without extra props.

function Base({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none">
      {children}
    </svg>
  );
}

export function TennisIcon() {
  return (
    <Base>
      <ellipse cx="19" cy="16" rx="9" ry="12" stroke="currentColor" strokeWidth="2" />
      <g stroke="currentColor" strokeWidth="1" opacity="0.75">
        <line x1="19" y1="5" x2="19" y2="27" />
        <line x1="10.5" y1="16" x2="27.5" y2="16" />
        <line x1="13" y1="8" x2="13" y2="24" />
        <line x1="25" y1="8" x2="25" y2="24" />
        <line x1="11.5" y1="11" x2="26.5" y2="11" />
        <line x1="11.5" y1="21" x2="26.5" y2="21" />
      </g>
      <line x1="19" y1="28" x2="19" y2="39" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="15" y1="39" x2="23" y2="39" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="35" cy="32" r="5" fill="currentColor" />
      <path d="M31 30 Q35 33 39 30" stroke="#f6f1e4" strokeWidth="1" fill="none" />
    </Base>
  );
}

export function RunningIcon() {
  return (
    <Base>
      <circle cx="26" cy="9" r="5" fill="currentColor" />
      <rect x="21" y="15" width="8" height="15" rx="4" fill="currentColor" transform="rotate(8 25 22)" />
      <rect x="7" y="17" width="16" height="5" rx="2.5" fill="currentColor" transform="rotate(-25 15 19)" />
      <rect x="24" y="12" width="16" height="5" rx="2.5" fill="currentColor" transform="rotate(35 32 14)" />
      <rect x="13" y="27" width="6" height="15" rx="3" fill="currentColor" transform="rotate(-32 16 29)" />
      <rect x="27" y="27" width="6" height="15" rx="3" fill="currentColor" transform="rotate(38 30 29)" />
    </Base>
  );
}

export function PressedFlowerIcon() {
  return (
    <Base>
      <rect x="8" y="10" width="32" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="8" y="31" width="32" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="11" cy="13.5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="37" cy="13.5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11" cy="34.5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="37" cy="34.5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <line x1="11" y1="17" x2="11" y2="31" stroke="currentColor" strokeWidth="1.5" />
      <line x1="37" y1="17" x2="37" y2="31" stroke="currentColor" strokeWidth="1.5" />
      <g stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="24" cy="19" rx="3" ry="5" transform="rotate(0 24 24)" />
        <ellipse cx="24" cy="29" rx="3" ry="5" />
        <ellipse cx="19" cy="24" rx="5" ry="3" />
        <ellipse cx="29" cy="24" rx="5" ry="3" />
      </g>
      <circle cx="24" cy="24" r="2.2" fill="currentColor" />
    </Base>
  );
}

export function BouquetIcon() {
  return (
    <Base>
      {[
        { cx: 16, cy: 14 },
        { cx: 27, cy: 10 },
        { cx: 34, cy: 17 },
      ].map((f, i) => (
        <g key={i} stroke="currentColor" strokeWidth="1.4">
          {[0, 72, 144, 216, 288].map((a) => (
            <circle
              key={a}
              cx={f.cx + Math.cos((a * Math.PI) / 180) * 3.2}
              cy={f.cy + Math.sin((a * Math.PI) / 180) * 3.2}
              r="2.4"
            />
          ))}
          <circle cx={f.cx} cy={f.cy} r="1.6" fill="currentColor" stroke="none" />
        </g>
      ))}
      <line x1="16" y1="17" x2="22" y2="38" stroke="currentColor" strokeWidth="1.6" />
      <line x1="27" y1="13" x2="23.5" y2="38" stroke="currentColor" strokeWidth="1.6" />
      <line x1="34" y1="20" x2="25" y2="38" stroke="currentColor" strokeWidth="1.6" />
      <path d="M18 36 L29 36 L26 41 L21 41 Z" fill="currentColor" />
    </Base>
  );
}

export function MusicNotesIcon() {
  return (
    <Base>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <line x1="35" y1="10" x2="35" y2="30" />
        <line x1="35" y1="10" x2="19" y2="14" />
        <line x1="19" y1="14" x2="19" y2="33" />
      </g>
      <ellipse cx="31.5" cy="32" rx="5" ry="3.6" fill="currentColor" transform="rotate(-12 31.5 32)" />
      <ellipse cx="15.5" cy="35" rx="5" ry="3.6" fill="currentColor" transform="rotate(-12 15.5 35)" />
    </Base>
  );
}

export function WipeoutIcon() {
  return (
    <Base>
      <g transform="rotate(-24 20 20)">
        <circle cx="20" cy="10" r="4.6" fill="currentColor" />
        <rect x="16.5" y="15" width="7" height="13" rx="3.5" fill="currentColor" />
        <rect x="6" y="14" width="13" height="4.6" rx="2.3" fill="currentColor" transform="rotate(-30 12.5 16.3)" />
        <rect x="19" y="12" width="13" height="4.6" rx="2.3" fill="currentColor" transform="rotate(40 25.5 14.3)" />
        <rect x="10" y="26" width="5.5" height="13" rx="2.75" fill="currentColor" transform="rotate(-20 12.75 32.5)" />
        <rect x="21" y="26" width="5.5" height="13" rx="2.75" fill="currentColor" transform="rotate(45 23.75 32.5)" />
      </g>
      <rect x="31" y="6" width="6" height="22" rx="3" fill="currentColor" opacity="0.85" transform="rotate(58 34 17)" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8">
        <path d="M4 40 Q8 35 12 40" />
        <path d="M13 43 Q17 38 21 43" />
        <path d="M23 40 Q27 35 31 40" />
      </g>
    </Base>
  );
}

export function BurntCupcakeIcon() {
  return (
    <Base>
      <path d="M14 40 L34 40 L31 25 L17 25 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <line x1="19" y1="28" x2="18" y2="38" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <line x1="24" y1="28" x2="24" y2="38" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <line x1="29" y1="28" x2="30" y2="38" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <path
        d="M15.5 25 C15 16 20 11 24 11 C28 11 33 16 32.5 25 Z"
        fill="currentColor"
      />
      <g stroke="#f6f1e4" strokeWidth="1.4" strokeLinecap="round" opacity="0.9">
        <path d="M19 21 L21 23" />
        <path d="M27 20 L29 22.5" />
        <path d="M23 16 L23.5 19" />
      </g>
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.85">
        <path d="M20 9 C22 6 18 5 20 2" />
        <path d="M27 9 C29 6 25 5 27 2" />
      </g>
    </Base>
  );
}

export function OperaSingerIcon() {
  return (
    <Base>
      <path d="M15 21 L33 21 L37 42 L11 42 Z" fill="currentColor" />
      <rect x="9" y="13" width="13" height="5" rx="2.5" fill="currentColor" transform="rotate(-55 15.5 15.5)" />
      <rect x="26" y="13" width="13" height="5" rx="2.5" fill="currentColor" transform="rotate(55 32.5 15.5)" />
      <circle cx="24" cy="11" r="7" fill="currentColor" />
      <ellipse cx="24" cy="13.5" rx="2.2" ry="3" fill="#f6f1e4" />
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.8">
        <path d="M34 9 Q37 11 34 14" />
        <path d="M37 6 Q41 11 37 17" />
      </g>
    </Base>
  );
}
