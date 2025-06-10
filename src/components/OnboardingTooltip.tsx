
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { OnboardingStep } from '@/hooks/useOnboarding';

interface OnboardingTooltipProps {
  step: OnboardingStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isVisible: boolean;
}

export const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  isVisible
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    const element = document.querySelector(step.target) as HTMLElement;
    if (element) {
      setTargetElement(element);
      
      // Scroll element into view smoothly
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });

      // Add highlight effect
      element.style.position = 'relative';
      element.style.zIndex = '1001';
      element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2)';
      element.style.borderRadius = '8px';
      element.style.transition = 'all 0.3s ease';

      const rect = element.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = 200;
      
      let top = rect.top;
      let left = rect.left;

      // Position tooltip based on placement
      switch (step.placement) {
        case 'top':
          top = rect.top - tooltipHeight - 16;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'bottom':
          top = rect.bottom + 16;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.left - tooltipWidth - 16;
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.right + 16;
          break;
        default:
          top = rect.bottom + 16;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
      }

      // Ensure tooltip stays within viewport
      if (left < 16) left = 16;
      if (left + tooltipWidth > window.innerWidth - 16) {
        left = window.innerWidth - tooltipWidth - 16;
      }
      if (top < 16) top = 16;
      if (top + tooltipHeight > window.innerHeight - 16) {
        top = window.innerHeight - tooltipHeight - 16;
      }

      setPosition({ top, left });
    }

    return () => {
      if (element) {
        element.style.position = '';
        element.style.zIndex = '';
        element.style.boxShadow = '';
        element.style.borderRadius = '';
      }
    };
  }, [step, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1000] transition-opacity duration-300" />
      
      {/* Tooltip */}
      <Card 
        className="fixed z-[1002] w-80 shadow-2xl border-2 border-primary/20 animate-scale-in"
        style={{ 
          top: position.top, 
          left: position.left,
          animation: 'scale-in 0.2s ease-out'
        }}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Play className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onPrev}
              disabled={currentStep === 0}
              className="min-w-[80px]"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip Tour
            </Button>

            <Button 
              size="sm" 
              onClick={onNext}
              className="min-w-[80px]"
            >
              {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
              {currentStep !== totalSteps - 1 && (
                <ChevronRight className="w-4 h-4 ml-1" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
