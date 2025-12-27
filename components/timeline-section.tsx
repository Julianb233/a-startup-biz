'use client';

import { useEffect, useRef, useState } from 'react';
import { Calendar, Settings, Users, Rocket, Headphones } from 'lucide-react';

interface TimelineStep {
  day: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const timelineSteps: TimelineStep[] = [
  {
    day: 'Day 1',
    title: 'Schedule Demo',
    description: '15-minute platform walkthrough',
    icon: Calendar,
  },
  {
    day: 'Day 2-3',
    title: 'Onboarding',
    description: 'Account setup and integration',
    icon: Settings,
  },
  {
    day: 'Day 4-5',
    title: 'Training',
    description: 'Team training and configuration',
    icon: Users,
  },
  {
    day: '48-72hrs',
    title: 'Go Live',
    description: 'Start offering insurance to members',
    icon: Rocket,
  },
  {
    day: 'Ongoing',
    title: 'Support',
    description: 'Dedicated account manager',
    icon: Headphones,
  },
];

export function TimelineSection() {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(
    new Array(timelineSteps.length).fill(false)
  );
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepElements = entry.target.querySelectorAll('[data-step-index]');
            stepElements.forEach((element, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => {
                  const updated = [...prev];
                  updated[index] = true;
                  return updated;
                });
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-slate-50" ref={timelineRef}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            What to Expect
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            From first contact to full implementation in 48-72 hours (emphasizing 48 hours)
          </p>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mt-3">
            Timeline depends on contract signing and how quickly you return required documents
          </p>
        </div>

        {/* Desktop Timeline (Horizontal) */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-[60px] left-0 right-0 h-0.5 bg-slate-200">
              <div
                className="h-full bg-teal-500 transition-all duration-1000 ease-out"
                style={{
                  width: visibleSteps.filter(Boolean).length > 0
                    ? `${(visibleSteps.filter(Boolean).length / timelineSteps.length) * 100}%`
                    : '0%'
                }}
              />
            </div>

            {/* Timeline Steps */}
            <div className="grid grid-cols-5 gap-4">
              {timelineSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    data-step-index={index}
                    className={`flex flex-col items-center text-center transition-all duration-500 ${
                      visibleSteps[index]
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {/* Icon Circle */}
                    <div
                      className={`w-[120px] h-[120px] rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
                        visibleSteps[index]
                          ? 'bg-teal-500 shadow-lg shadow-teal-500/30 scale-100'
                          : 'bg-slate-200 scale-90'
                      }`}
                    >
                      <Icon
                        className={`w-12 h-12 transition-colors duration-500 ${
                          visibleSteps[index] ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-teal-600 uppercase tracking-wide">
                        {step.day}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Timeline (Vertical) */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-[30px] top-0 bottom-0 w-0.5 bg-slate-200">
              <div
                className="w-full bg-teal-500 transition-all duration-1000 ease-out"
                style={{
                  height: visibleSteps.filter(Boolean).length > 0
                    ? `${(visibleSteps.filter(Boolean).length / timelineSteps.length) * 100}%`
                    : '0%'
                }}
              />
            </div>

            {/* Timeline Steps */}
            <div className="space-y-8">
              {timelineSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    data-step-index={index}
                    className={`flex gap-6 transition-all duration-500 ${
                      visibleSteps[index]
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-4'
                    }`}
                  >
                    {/* Icon Circle */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-500 ${
                          visibleSteps[index]
                            ? 'bg-teal-500 shadow-lg shadow-teal-500/30 scale-100'
                            : 'bg-slate-200 scale-90'
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 transition-colors duration-500 ${
                            visibleSteps[index] ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <div className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">
                        {step.day}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 md:mt-16">
          <p className="text-lg text-slate-600 mb-6">
            Ready to get started? Schedule your demo today.
          </p>
          <button className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors duration-200 shadow-lg shadow-teal-500/30">
            Schedule Your Demo
          </button>
        </div>
      </div>
    </section>
  );
}

export default TimelineSection;
