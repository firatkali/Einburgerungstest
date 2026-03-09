type OptionState = 'idle' | 'selected' | 'correct' | 'wrong';

type Props = {
  label: string;
  index: number;
  state: OptionState;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'exam' | 'examPlain';
  fixedHeight?: boolean;
};

const LETTERS = ['A', 'B', 'C', 'D'];

const stateClasses: Record<OptionState, string> = {
  idle:     'bg-[#1A2B40] border-[#A0B0C0]/20 text-white hover:bg-[#1A2B40]/80 active:scale-[0.98]',
  selected: 'bg-[#00C2CC]/10 border-[#00C2CC]/60 text-white',
  correct:  'bg-emerald-500/20 border-emerald-400 text-emerald-100',
  wrong:    'bg-red-500/20 border-red-400 text-red-100',
};

const letterClasses: Record<OptionState, string> = {
  idle:     'bg-[#A0B0C0]/20 text-[#A0B0C0]',
  selected: 'bg-[#00C2CC]/30 text-[#00C2CC]',
  correct:  'bg-emerald-400 text-white',
  wrong:    'bg-red-400 text-white',
};

const examStateClasses: Record<OptionState, string> = {
  idle: 'bg-white border-[#DED9EC] text-[#2A2633]',
  selected: 'bg-[#D8EDC8] border-[#B9D79E] text-[#223018]',
  correct: 'bg-[#D8EDC8] border-[#B9D79E] text-[#223018]',
  wrong: 'bg-[#F7D6D9] border-[#E7AAB2] text-[#5B2431]',
};

const examLetterClasses: Record<OptionState, string> = {
  idle: 'text-[#5D5768]',
  selected: 'text-[#44622A]',
  correct: 'text-[#44622A]',
  wrong: 'text-[#8A3447]',
};

const examPlainStateClasses: Record<OptionState, string> = {
  idle: 'bg-transparent border-transparent text-white',
  selected: 'bg-transparent border-transparent text-[#00C2CC]',
  correct: 'bg-transparent border-transparent text-emerald-300',
  wrong: 'bg-transparent border-transparent text-red-300',
};

export function AnswerOption({ label, index, state, onClick, disabled, variant = 'default', fixedHeight = false }: Props) {
  const activeStateClasses = variant === 'exam'
    ? examStateClasses
    : variant === 'examPlain'
      ? examPlainStateClasses
      : stateClasses;
  const activeLetterClasses = variant === 'exam' ? examLetterClasses : letterClasses;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full border transition-all duration-200 text-left ${
        variant === 'examPlain'
          ? 'rounded-none px-0 py-3'
          : fixedHeight
            ? 'h-[88px] px-5 py-4 rounded-2xl'
            : 'p-4 rounded-2xl'
      } ${activeStateClasses[state]} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <span className={`flex h-full items-start gap-3 ${variant === 'exam' ? '' : 'items-center'}`}>
        <span className={`shrink-0 ${
          variant === 'exam'
            ? 'w-10 pt-0.5 text-lg font-bold'
            : variant === 'examPlain'
              ? 'w-8 text-lg font-bold text-[#A0B0C0]'
              : 'w-8 text-[18px] font-semibold h-8 rounded-full flex items-center justify-center'
        } ${variant === 'examPlain' ? '' : activeLetterClasses[state]}`}>
          {variant === 'exam' || variant === 'examPlain' ? `${LETTERS[index]}:` : LETTERS[index]}
        </span>
        <span className={`flex-1 ${
          variant === 'exam'
            ? 'text-[1.2rem] leading-7 font-semibold'
            : variant === 'examPlain'
              ? 'text-[18px] leading-7 font-medium text-white'
              : 'text-[18px] leading-[1.3]'
        } ${fixedHeight ? 'max-h-full overflow-y-auto pr-1' : ''}`}>{label}</span>
      </span>
    </button>
  );
}
