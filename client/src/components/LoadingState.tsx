import type { GenerationStep } from '../types';

interface LoadingStateProps {
  currentStep: GenerationStep;
}

const STEPS = [
  {
    id: 'keywords' as GenerationStep,
    label: 'Generating Keywords',
    desc: 'Analyzing your business and creating intent-grouped keywords',
    icon: '1',
  },
  {
    id: 'gmb' as GenerationStep,
    label: 'Crafting GMB Post',
    desc: 'Writing a publish-ready Google Business post with your keywords',
    icon: '2',
  },
  {
    id: 'description' as GenerationStep,
    label: 'Writing SEO Description',
    desc: 'Composing a 3-paragraph SEO-optimized business description',
    icon: '3',
  },
];

const STEP_ORDER: GenerationStep[] = ['keywords', 'gmb', 'description'];

function getStepStatus(stepId: GenerationStep, currentStep: GenerationStep) {
  const stepIdx = STEP_ORDER.indexOf(stepId);
  const currentIdx = STEP_ORDER.indexOf(currentStep);
  if (currentIdx > stepIdx) return 'done';
  if (currentIdx === stepIdx) return 'active';
  return 'idle';
}

function getProgress(currentStep: GenerationStep): number {
  const map: Record<GenerationStep, number> = {
    idle: 0,
    keywords: 20,
    gmb: 55,
    description: 85,
    done: 100,
    error: 0,
  };
  return map[currentStep] || 0;
}

export function LoadingState({ currentStep }: LoadingStateProps) {
  const progress = getProgress(currentStep);

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <div className="card-header" style={{ justifyContent: 'center', marginBottom: '28px' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="card-title" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>AI Generation in Progress</div>
          <div className="card-subtitle">This takes about 15–25 seconds. Please wait.</div>
        </div>
      </div>

      <div className="loading-steps">
        {STEPS.map(stepDef => {
          const status = getStepStatus(stepDef.id, currentStep);
          return (
            <div key={stepDef.id} className={`loading-step ${status}`}>
              <div className={`step-indicator ${status}`}>
                {status === 'active' ? (
                  <div className="spinner" />
                ) : status === 'done' ? (
                  '✓'
                ) : (
                  stepDef.icon
                )}
              </div>
              <div className="step-info">
                <div className="step-label">{stepDef.label}</div>
                <div className="step-desc">{stepDef.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="loading-progress">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Progress</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-violet-light)', fontWeight: 600 }}>
            {progress}%
          </span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
