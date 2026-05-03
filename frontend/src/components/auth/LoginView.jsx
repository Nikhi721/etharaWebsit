import { memo } from 'react';
import { ChevronRight, Eye, EyeOff } from 'lucide-react';
import '../../styles/auth.css';

const LoginView = memo(({
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  loginError,
  showPassword,
  setShowPassword,
  handleLogin,
  setView
}) => (
  <div className="auth-page">
    <div className="auth-card">
      <div className="logo-row">
        <div className="logo-mark">TT</div>
        <div>
          <h1>Task Track</h1>
          <p className="muted">Ethara.AI Intelligence Platform</p>
        </div>
      </div>

      <div className="tabs">
        <button className="tab active" type="button">Sign In</button>
        <button className="tab" type="button" onClick={() => setView('register')}>Register</button>
      </div>

      <form className="auth-form" onSubmit={handleLogin}>
        <label className="eyebrow">Login Role</label>
        <div className="role-grid">
          {['Admin', 'Project Lead', 'Quality Reviewer', 'Tasker'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRole(item)}
              className={`role-choice ${role === item ? 'selected' : ''}`}
            >
              {item}
            </button>
          ))}
        </div>

        {loginError && <div className="error-box">Invalid credentials or unauthorized access.</div>}

        <input
          className="field"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email Address"
          required
        />

        <div className="password-field">
          <input
            className="field"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
          />
          <button
            type="button"
            onMouseEnter={() => setShowPassword(true)}
            onMouseLeave={() => setShowPassword(false)}
            aria-label="Show password"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        <button className="primary-button full-width" type="submit">
          Sign In <ChevronRight size={18} />
        </button>
      </form>
    </div>
  </div>
));

export default LoginView;
