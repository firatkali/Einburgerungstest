type Props = { current: number; total: number; className?: string };

export function ProgressBar({ current, total, className = '' }: Props) {
  const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  return (
    <div className={`w-full bg-[#A0B0C0]/20 rounded-full h-2 ${className}`}>
      <div
        className="bg-[#00C2CC] rounded-full h-2 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
