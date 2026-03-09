type Props = { seconds: number };

export function Timer({ seconds }: Props) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  const isWarning = seconds <= 300; // last 5 minutes

  return (
    <span className={`font-mono font-bold text-lg tabular-nums ${isWarning ? 'text-red-400 animate-pulse' : 'text-white'}`}>
      {m}:{s}
    </span>
  );
}
