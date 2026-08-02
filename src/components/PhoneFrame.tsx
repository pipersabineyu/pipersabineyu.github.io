export function PhoneFrame({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto aspect-[9/19.5] w-full max-w-[260px] rounded-[2.6rem] bg-[#141414] p-[10px] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.3)] ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-black">
        <video
          className="h-full w-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-[#141414]" />
      </div>
      <div className="absolute -left-[2px] top-24 h-7 w-[3px] rounded-l bg-[#141414]" />
      <div className="absolute -left-[2px] top-36 h-11 w-[3px] rounded-l bg-[#141414]" />
      <div className="absolute -right-[2px] top-28 h-14 w-[3px] rounded-r bg-[#141414]" />
    </div>
  );
}
