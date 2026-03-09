type Props = {
  label: string;
  value: string | number;
  icon?: string;
  accent?: string;
};

export function StatCard({ label, value, icon }: Props) {
  return (
    <div className="bg-[#1A2B40] border border-[#A0B0C0]/20 rounded-2xl p-4 flex flex-col gap-1">
      {icon && <span className="text-2xl">{icon}</span>}
      <span className="text-[#A0B0C0] text-xs font-medium uppercase tracking-wide">{label}</span>
      <span className="text-white text-2xl font-bold">{value}</span>
    </div>
  );
}
