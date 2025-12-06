import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useState } from 'react';
import './styles/TenderForm.css';

const tenderSchema = z.object({
  gemNumber: z.string().min(1, 'GEM number is required'),
  subHeading: z.string().min(1, 'Sub heading is required'),
  consignees: z.string().min(1, 'Consignee(s) are required'),
  numResources: z.number().positive('Must be a positive number'),
  serviceCharge: z.number().min(3.85, 'Must be 3.85% or greater'),
  minimumDailyWages: z.number().positive('Must be a positive number'),
  bonus: z.number().min(0, 'Must be 0 or greater'),
  edli: z.number().min(0, 'Must be 0 or greater'),
  epfAdminCharge: z.number().min(0, 'Must be 0 or greater'),
  operationalAllowance1: z.number().min(0, 'Must be 0 or greater'),
  operationalAllowance2: z.number().min(0, 'Must be 0 or greater'),
  operationalAllowance3: z.number().min(0, 'Must be 0 or greater'),
  overtimeHours: z.number().min(0, 'Must be 0 or greater'),
  overtimeRemuneration: z.number().min(0, 'Must be 0 or greater'),
  esi: z.number().min(0, 'Must be 0 or greater'),
  providentFund: z.number().min(0, 'Must be 0 or greater'),
  workingDays: z.number().min(1, 'Must be at least 1').max(31, 'Must be at most 31'),
  duration: z.number().positive('Must be a positive number')
});

import Navbar from './components/Navbar';

export default function TenderForm() {
  const [tenderCount, setTenderCount] = useState(0);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(tenderSchema),
    defaultValues: {
      serviceCharge: 0,
      bonus: 0,
      edli: 0,
      epfAdminCharge: 0,
      operationalAllowance1: 0,
      operationalAllowance2: 0,
      operationalAllowance3: 0,
      overtimeHours: 0,
      overtimeRemuneration: 0,
      esi: 0,
      providentFund: 0,
      workingDays: 26
    }
  });

  const onSubmit = async (data, submitAndRepeat = false) => {
    try {
      // Submit tender data
      const response = await fetch('/api/tender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to submit tender');
      
      setTenderCount(prev => prev + 1);
      toast.success('Tender submitted successfully!');

      if (submitAndRepeat) {
        // Reset form for next tender
        reset();
      } else {
        // Generate PDF with all tenders
        const pdfResponse = await fetch('/api/generate-pdf', {
          method: 'POST'
        });

        if (!pdfResponse.ok) throw new Error('Failed to generate PDF');

        const blob = await pdfResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tenders.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Reset everything
        reset();
        setTenderCount(0);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formFields = [
    { name: 'gemNumber', label: 'GEM Number', type: 'text' },
    { name: 'subHeading', label: 'Sub Heading', type: 'text' },
    { name: 'consignees', label: 'Consignee(s)', type: 'textarea' },
    { name: 'numResources', label: 'Number of Resources', type: 'number' },
    { name: 'serviceCharge', label: 'Service Charge (% incl. GST)', type: 'number', step: '0.01' },
    { name: 'minimumDailyWages', label: 'Minimum Daily Wages (₹)', type: 'number', step: '0.01' },
    { name: 'bonus', label: 'Bonus (₹/day)', type: 'number', step: '0.01' },
    { name: 'edli', label: 'EDLI (₹/day)', type: 'number', step: '0.01' },
    { name: 'epfAdminCharge', label: 'EPF Admin Charge (₹/day)', type: 'number', step: '0.01' },
    { name: 'operationalAllowance1', label: 'Operational Allowance 1 (₹/day)', type: 'number', step: '0.01' },
    { name: 'operationalAllowance2', label: 'Operational Allowance 2 (₹/day)', type: 'number', step: '0.01' },
    { name: 'operationalAllowance3', label: 'Operational Allowance 3 (₹/day)', type: 'number', step: '0.01' },
    { name: 'overtimeHours', label: 'Overtime Hours (per month)', type: 'number' },
    { name: 'overtimeRemuneration', label: 'Overtime Remuneration (₹/hour)', type: 'number', step: '0.01' },
    { name: 'esi', label: 'ESI (₹/day)', type: 'number', step: '0.01' },
    { name: 'providentFund', label: 'Provident Fund (₹/day)', type: 'number', step: '0.01' },
    { name: 'workingDays', label: 'Working Days per Month', type: 'number' },
    { name: 'duration', label: 'Duration (months)', type: 'number' }
  ];

  return (
    <div className="form-container">
      <Navbar />
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">Tender Details Form</h1>
          {tenderCount > 0 && (
            <div className="tender-count">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tenders submitted: {tenderCount}</span>
            </div>
          )}
        </div>
        
        <div className="form-body">
          <form onSubmit={handleSubmit((data) => onSubmit(data, false))}>
            <div className="form-grid">
              {formFields.map((field) => (
                <div key={field.name} className={`form-group ${field.type === 'textarea' ? 'col-span-2' : ''}`}>
                  <label className="form-label">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      {...register(field.name)}
                      className="form-input form-textarea"
                      rows={3}
                    />
                  ) : (
                    <div className="input-with-unit">
                      <input
                        type={field.type}
                        step={field.step}
                        {...register(field.name, { 
                          valueAsNumber: field.type === 'number'
                        })}
                        className="form-input"
                      />
                      {field.type === 'number' && (
                        <span className="input-unit">
                          {field.name.includes('serviceCharge') ? '%' : 
                           field.name.includes('Hours') ? 'hrs' : 'Rs.'}
                        </span>
                      )}
                    </div>
                  )}
                  {errors[field.name] && (
                    <div className="error-message">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{errors[field.name].message}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit & Generate PDF
              </button>
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, true))}
                className="btn btn-secondary"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Submit & Add Another
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}