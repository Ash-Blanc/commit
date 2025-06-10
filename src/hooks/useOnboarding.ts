
import { useState, useEffect } from 'react';

export interface OnboardingStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const onboardingSteps: OnboardingStep[] = [
  {
    target: '[data-onboarding="welcome"]',
    title: 'Welcome to Your Dashboard!',
    content: 'This is your personalized dashboard where you can track your college application progress.',
    placement: 'bottom'
  },
  {
    target: '[data-onboarding="stats"]',
    title: 'Your Progress Stats',
    content: 'See how much time you\'ve saved and track your application progress here.',
    placement: 'bottom'
  },
  {
    target: '[data-onboarding="applications"]',
    title: 'Smart Application Tracker',
    content: 'View all your college applications with automated form filling and submission tracking.',
    placement: 'left'
  },
  {
    target: '[data-onboarding="profile"]',
    title: 'Your Profile',
    content: 'Keep your academic information updated for better AI recommendations.',
    placement: 'left'
  },
  {
    target: '[data-onboarding="actions"]',
    title: 'Quick Actions',
    content: 'Access key features like college search, essay writing, and profile updates.',
    placement: 'top'
  }
];

export const useOnboarding = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const hasCompleted = localStorage.getItem('onboarding-completed');
    if (!hasCompleted) {
      setTimeout(() => setIsActive(true), 1000); // Delay to let page load
    } else {
      setHasSeenOnboarding(true);
    }
  }, []);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    setIsActive(false);
    localStorage.setItem('onboarding-completed', 'true');
    setHasSeenOnboarding(true);
  };

  const restartOnboarding = () => {
    setCurrentStep(0);
    setIsActive(true);
    localStorage.removeItem('onboarding-completed');
    setHasSeenOnboarding(false);
  };

  return {
    isActive,
    currentStep,
    steps: onboardingSteps,
    hasSeenOnboarding,
    nextStep,
    prevStep,
    skipOnboarding,
    completeOnboarding,
    restartOnboarding
  };
};
