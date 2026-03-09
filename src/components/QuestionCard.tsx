import { Question, Language } from '../types';
import { getQuestionOptions, getQuestionText } from '../lib/language';
import { AnswerOption } from './AnswerOption';

type Props = {
  question: Question;
  language: Language;
  selectedIndex: number | null;
  revealed: boolean;
  onAnswer: (index: number) => void;
};

export function QuestionCard({ question, language, selectedIndex, revealed, onAnswer }: Props) {
  const qText = getQuestionText(question, language);
  const options = getQuestionOptions(question, language);

  const getState = (i: number): 'idle' | 'selected' | 'correct' | 'wrong' => {
    if (!revealed) return selectedIndex === i ? 'selected' : 'idle';
    if (i === question.correctIndex) return 'correct';
    if (selectedIndex === i && i !== question.correctIndex) return 'wrong';
    return 'idle';
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-white font-semibold text-base leading-relaxed">{qText}</p>
      <div className="flex flex-col gap-3">
        {options.map((opt, i) => (
          <AnswerOption
            key={i}
            label={opt}
            index={i}
            state={getState(i)}
            onClick={() => !revealed && onAnswer(i)}
            disabled={revealed}
          />
        ))}
      </div>
    </div>
  );
}
