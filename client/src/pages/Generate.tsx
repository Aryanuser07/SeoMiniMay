import { useState } from 'react';
import { generateContent } from '../services/api';
import type { BusinessFormData, GenerationOutputs, GenerationStep } from '../types';
import { BusinessForm } from '../components/BusinessForm';
import { LoadingState } from '../components/LoadingState';
import { KeywordsPanel } from '../components/KeywordsPanel';
import { GMBPostPanel } from '../components/GMBPostPanel';
import { DescriptionPanel } from '../components/DescriptionPanel';

export function Generate() {
  const [step, setStep] = useState<GenerationStep>('idle');
  const [outputs, setOutputs] = useState<GenerationOutputs | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: BusinessFormData) => {
    setStep('keywords');
    setError(null);
    setOutputs(null);

    try {
      // Simulate step progression for UX
      const stepTimer1 = setTimeout(() => setStep('gmb'), 5000);
      const stepTimer2 = setTimeout(() => setStep('description'), 12000);

      const result = await generateContent(formData);

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      setOutputs(result.outputs);
      setStep('done');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate content. Please try again.';
      setError(message);
      setStep('error');
    }
  };

  const handleReset = () => {
    setStep('idle');
    setOutputs(null);
    setError(null);
  };

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">
          <span>✨</span>
          <span>Powered by Gemini AI</span>
        </div>
        <h1 className="hero-title">
          Generate SEO Content<br />
          <span className="hero-title-gradient">for Local Businesses</span>
        </h1>
        <p className="hero-subtitle">
          Enter your business details and get AI-powered keywords, Google Business posts, 
          and SEO descriptions — all in one click.
        </p>
      </div>

      <div className="container">
        {/* Form */}
        {step === 'idle' || step === 'error' ? (
          <>
            <BusinessForm onSubmit={handleSubmit} isLoading={false} />
            {error && (
              <div style={{
                marginTop: '16px',
                padding: '16px 20px',
                background: 'rgba(255, 80, 80, 0.08)',
                border: '1px solid rgba(255, 80, 80, 0.3)',
                borderRadius: '12px',
                color: '#ff8080',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⚠️</span> {error}
              </div>
            )}
          </>
        ) : step !== 'done' ? (
          <LoadingState currentStep={step} />
        ) : null}

        {/* Output Panels */}
        {step === 'done' && outputs && (
          <div className="output-section">
            <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.4rem', fontWeight: 700 }}>
                🎉 Generated Content
              </h2>
              <button className="btn btn-ghost" onClick={handleReset} style={{ fontSize: '0.85rem' }}>
                ↩ Generate New
              </button>
            </div>

            <div className="stats-row">
              <div className="stat-pill stat-pill-violet">
                🔑 {(outputs.keywords.high_intent.length + outputs.keywords.informational.length)} Keywords
              </div>
              <div className="stat-pill stat-pill-teal">
                📝 Google Business Post
              </div>
              <div className="stat-pill stat-pill-amber">
                📄 SEO Description
              </div>
            </div>

            <KeywordsPanel keywords={outputs.keywords} />
            <GMBPostPanel post={outputs.gmbPost} />
            <DescriptionPanel description={outputs.seoDescription} />
          </div>
        )}
      </div>
    </div>
  );
}
