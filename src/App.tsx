import { useState, useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { useProgress } from './hooks/useProgress';
import { revenueCatManager } from './lib/revenuecat';
import { isRtlLanguage } from './lib/language';

import { WelcomeScreen } from './screens/onboarding/WelcomeScreen';
import { HowItWorksScreen } from './screens/onboarding/HowItWorksScreen';
import { StateSelectScreen } from './screens/onboarding/StateSelectScreen';
import { PaywallScreen } from './screens/onboarding/PaywallScreen';

import { HomeScreen } from './screens/main/HomeScreen';
import { StudyScreen } from './screens/main/StudyScreen';
import { ExamScreen } from './screens/main/ExamScreen';
import { ExamResultScreen } from './screens/main/ExamResultScreen';
import { WrongQuestionsScreen } from './screens/main/WrongQuestionsScreen';
import { SettingsScreen } from './screens/main/SettingsScreen';

import { Bundesland, ExamResult, Language } from './types';

type OnboardingStep = 'welcome' | 'howItWorks' | 'stateSelect' | 'paywall';
type MainView = 'home' | 'study' | 'exam' | 'exam-result' | 'wrong' | 'settings';

export default function App() {
  const {
    progress,
    setLanguage, setSelectedState, setPurchased,
    setOnboardingComplete, addExamResult, clearWrongAnswer,
    recordStudyAnswer,
    toggleBookmark, reset,
  } = useProgress();

  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome');
  const [mainView, setMainView] = useState<MainView>('home');
  const [lastResult, setLastResult] = useState<ExamResult | null>(null);
  const [reviewIds, setReviewIds] = useState<number[] | null>(null);

  // Initialize RevenueCat
  useEffect(() => {
    revenueCatManager.configure();
  }, []);

  // Android back button
  useEffect(() => {
    const sub = CapApp.addListener('backButton', () => {
      if (mainView !== 'home') setMainView('home');
    });
    return () => { sub.then(h => h.remove()); };
  }, [mainView]);

  useEffect(() => {
    document.documentElement.lang = progress.language;
    document.documentElement.dir = isRtlLanguage(progress.language) ? 'rtl' : 'ltr';
  }, [progress.language]);

  const isOnboarded = progress.purchased && progress.onboardingComplete;

  // --- Onboarding ---
  if (!isOnboarded) {
    if (onboardingStep === 'welcome') {
      return (
        <WelcomeScreen
          language={progress.language}
          onLanguageChange={setLanguage}
          onNext={() => setOnboardingStep('howItWorks')}
        />
      );
    }
    if (onboardingStep === 'howItWorks') {
      return (
        <HowItWorksScreen
          language={progress.language}
          onNext={() => setOnboardingStep('stateSelect')}
          onBack={() => setOnboardingStep('welcome')}
        />
      );
    }
    if (onboardingStep === 'stateSelect') {
      return (
        <StateSelectScreen
          language={progress.language}
          onSelect={(state: Bundesland) => { setSelectedState(state); setOnboardingStep('paywall'); }}
          onBack={() => setOnboardingStep('howItWorks')}
        />
      );
    }
    if (onboardingStep === 'paywall') {
      const handlePurchased = () => { setPurchased(true); setOnboardingComplete(); };
      return (
        <PaywallScreen
          language={progress.language}
          onPurchased={handlePurchased}
          onBack={() => setOnboardingStep('stateSelect')}
        />
      );
    }
  }

  // --- Main App ---
  const handleExamComplete = (wrongIds: number[], score: number, passed: boolean, timeSpent: number) => {
    const result: ExamResult = { date: new Date().toISOString(), score, passed, timeSpent, wrongIds };
    addExamResult(result);
    setLastResult(result);
    setReviewIds(wrongIds);
    setMainView('exam-result');
  };

  return (
    <div dir={isRtlLanguage(progress.language) ? 'rtl' : 'ltr'}>
      {mainView === 'home' && (
        <HomeScreen
          progress={progress}
          onStartExam={() => setMainView('exam')}
          onStudy={() => setMainView('study')}
          onSettings={() => setMainView('settings')}
        />
      )}
      {mainView === 'study' && (
        <StudyScreen
          progress={progress}
          onToggleBookmark={toggleBookmark}
          onRecordStudyAnswer={recordStudyAnswer}
          onBack={() => setMainView('home')}
        />
      )}
      {mainView === 'exam' && progress.selectedState && (
        <ExamScreen
          progress={progress}
          onExamComplete={handleExamComplete}
          onAbort={() => setMainView('home')}
        />
      )}
      {mainView === 'exam-result' && lastResult && (
        <ExamResultScreen
          result={lastResult}
          language={progress.language}
          onRetry={() => {
            setReviewIds(null);
            setMainView('exam');
          }}
          onHome={() => {
            setReviewIds(null);
            setMainView('home');
          }}
          onReview={() => setMainView('wrong')}
        />
      )}
      {mainView === 'wrong' && (
        <WrongQuestionsScreen
          progress={progress}
          reviewIds={reviewIds}
          onClearWrong={clearWrongAnswer}
          onBack={() => {
            setReviewIds(null);
            setMainView('home');
          }}
        />
      )}
      {mainView === 'settings' && (
        <SettingsScreen
          progress={progress}
          onLanguageChange={(lang: Language) => setLanguage(lang)}
          onStateChange={(state: Bundesland) => setSelectedState(state)}
          onReset={reset}
          onBack={() => setMainView('home')}
        />
      )}
    </div>
  );
}
