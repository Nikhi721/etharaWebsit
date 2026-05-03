import { memo, useState } from 'react';
import '../../styles/auth.css';

const RegisterView = memo(({ setView, reviewers, leads, taskers, onRegister }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'Tasker',
    email: '',
    password: '',
    lead: '',
    reviewer: ''
  });
  const [error, setError] = useState('');

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const mail = formData.email.toLowerCase();

    if (formData.role === 'Project Lead' && !leads.find((lead) => lead.email.toLowerCase() === mail)) {
      setError('Mail id is not correct');
      return;
    }

    if (formData.role === 'Quality Reviewer') {
      const auth = reviewers.find((reviewer) => reviewer.email.toLowerCase() === mail);
      if (!auth) return setError('Mail id is not correct');
      if (auth.assignedLead !== formData.lead) return setError('You chose the wrong Project Lead');
    }

    if (formData.role === 'Tasker') {
      const auth = taskers.find((tasker) => tasker.email.toLowerCase() === mail);
      if (!auth) return setError('Mail id is not correct');
      if (auth.assignedLead !== formData.lead || auth.assignedReviewer !== formData.reviewer) {
        return setError('Choose correct Quality Reviewer and Project Lead');
      }
    }

    const result = await onRegister(formData);
    if (!result?.ok) setError(result?.message || 'Registration failed');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="tabs">
          <button className="tab" type="button" onClick={() => setView('login')}>Sign In</button>
          <button className="tab active" type="button">Register</button>
        </div>

        <form className="auth-form scroll-form custom-scrollbar" onSubmit={handleRegisterSubmit}>
          {error && <div className="error-box">{error}</div>}

          <div className="role-grid three">
            {['Project Lead', 'Quality Reviewer', 'Tasker'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => updateField('role', item)}
                className={`role-choice compact ${formData.role === item ? 'selected' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>

          <input className="field" type="text" autoComplete="name" placeholder="Full Name" onChange={(event) => updateField('fullName', event.target.value)} required />

          {(formData.role === 'Tasker' || formData.role === 'Quality Reviewer') && (
            <select className="select" onChange={(event) => updateField('lead', event.target.value)} required>
              <option value="">Select Project Lead</option>
              {leads.map((lead) => <option key={lead.email} value={lead.name}>{lead.name}</option>)}
            </select>
          )}

          {formData.role === 'Tasker' && (
            <select className="select" onChange={(event) => updateField('reviewer', event.target.value)} required>
              <option value="">Select Quality Reviewer</option>
              {reviewers.map((reviewer) => <option key={reviewer.email} value={reviewer.name}>{reviewer.name}</option>)}
            </select>
          )}

          <input className="field" type="email" autoComplete="off" placeholder="Work Email" onChange={(event) => updateField('email', event.target.value)} required />
          <input className="field" type="password" autoComplete="new-password" placeholder="Password" onChange={(event) => updateField('password', event.target.value)} required />
          <button className="primary-button full-width" type="submit">Complete Setup</button>
        </form>
      </div>
    </div>
  );
});

export default RegisterView;
