import { useState } from 'react';
import type { BusinessFormData } from '../types';

const CATEGORIES = [
  'Salon / Beauty Parlour',
  'Restaurant / Café',
  'Gym / Fitness Center',
  'Dental Clinic',
  'Medical / Healthcare',
  'Boutique / Fashion',
  'Pharmacy',
  'Real Estate',
  'Automobile / Garage',
  'Educational Institute',
  'Hotel / Guest House',
  'Bakery / Sweet Shop',
  'Electronics Store',
  'Grocery / Supermarket',
  'Photography Studio',
  'Interior Design',
  'Legal / Law Firm',
  'Accounting / CA Firm',
  'Other',
];

interface BusinessFormProps {
  onSubmit: (data: BusinessFormData) => void;
  isLoading: boolean;
}

export function BusinessForm({ onSubmit, isLoading }: BusinessFormProps) {
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: '',
    category: '',
    location: '',
    description: '',
    targetAudience: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.businessName.trim() && formData.category && formData.location.trim();

  return (
    <div className="card" style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div className="card-header">
        <div className="card-icon card-icon-violet">🏢</div>
        <div>
          <div className="card-title">Business Details</div>
          <div className="card-subtitle">Fill in the details to generate SEO content</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Business Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="businessName">
              Business Name <span className="required">*</span>
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              className="form-input"
              placeholder="e.g., Glamour Beauty Studio"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="category">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="location">
              City / Location <span className="required">*</span>
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className="form-input"
              placeholder="e.g., Patna, Bihar"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          {/* Target Audience */}
          <div className="form-group">
            <label className="form-label" htmlFor="targetAudience">
              Target Audience <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              id="targetAudience"
              name="targetAudience"
              type="text"
              className="form-input"
              placeholder="e.g., Working women aged 20–40"
              value={formData.targetAudience}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="description">
              Business Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="Briefly describe your business, specialties, or anything unique about it..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            id="generate-btn"
            className="btn btn-primary"
            disabled={!isValid || isLoading}
            style={{ minWidth: '180px', fontSize: '0.95rem' }}
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                Generating...
              </>
            ) : (
              <>Generate SEO Content</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
