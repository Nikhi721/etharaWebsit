import { useEffect, useState } from 'react';
import LoginView from './components/auth/LoginView.jsx';
import RegisterView from './components/auth/RegisterView.jsx';
import AdminDashboardView from './components/admin/AdminDashboardView.jsx';
import DashboardView from './components/dashboard/DashboardView.jsx';
import { api, clearAuthToken, hasAuthToken, saveAuthToken } from './services/api.js';
import { formatDuration, getFormattedDate, getFormattedTime } from './utils/time.js';

const fallbackStaffLists = {
  leads: [{ name: 'Piyush Singh Tomar', email: 'piyush.t@ethara.ai' }],
  reviewers: [{ name: 'Sanyam Sehrawat', email: 'sanyam.s@ethara.ai', assignedLead: 'Piyush Singh Tomar' }],
  taskers: [],
  projects: [
    { id: 'llm-eval', name: 'LLM Data Evaluation Project', duration: '5m' },
    { id: 'img-rank', name: 'Text-to-Image Ranking', duration: '10m' }
  ]
};

const adminCredentials = {
  email: 'nikhil.k@ethara.ai',
  password: 'password123'
};

const SESSION_CACHE_KEY = 'taskTrackSession';
const SESSION_CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const normalizeStaffLists = (staff = [], projects = []) => ({
  leads: staff.filter((item) => item.staffType === 'leads'),
  reviewers: staff.filter((item) => item.staffType === 'reviewers'),
  taskers: staff.filter((item) => item.staffType === 'taskers'),
  projects: projects.length ? projects : fallbackStaffLists.projects
});

const getCachedSession = () => {
  if (!hasAuthToken()) return null;

  try {
    const cached = JSON.parse(localStorage.getItem(SESSION_CACHE_KEY));
    if (!cached?.user || !cached?.view || cached.expiresAt <= Date.now()) {
      localStorage.removeItem(SESSION_CACHE_KEY);
      return null;
    }
    return cached;
  } catch {
    localStorage.removeItem(SESSION_CACHE_KEY);
    return null;
  }
};

const saveSessionCache = (user, view) => {
  localStorage.setItem(
    SESSION_CACHE_KEY,
    JSON.stringify({
      user,
      view,
      expiresAt: Date.now() + SESSION_CACHE_DURATION_MS
    })
  );
};

const clearSessionCache = () => {
  localStorage.removeItem(SESSION_CACHE_KEY);
};

const App = () => {
  const [cachedSession] = useState(getCachedSession);
  const [view, setView] = useState(cachedSession?.view || 'login');
  const [isRestoringSession, setIsRestoringSession] = useState(!cachedSession);
  const [user, setUser] = useState(cachedSession?.user || null);
  const [role, setRole] = useState('Admin');
  const [email, setEmail] = useState(adminCredentials.email);
  const [password, setPassword] = useState(adminCredentials.password);
  const [loginError, setLoginError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [staffLists, setStaffLists] = useState(fallbackStaffLists);

  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTimeStr, setPunchInTimeStr] = useState(null);
  const [punchOutTimeStr, setPunchOutTimeStr] = useState(null);
  const [punchInDate, setPunchInDate] = useState(null);
  const [punchOutDate, setPunchOutDate] = useState(null);

  const [taskId, setTaskId] = useState('');
  const [project, setProject] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [justification, setJustification] = useState('');
  const [activeTask, setActiveTask] = useState(null);
  const [taskStartTime, setTaskStartTime] = useState(null);
  const [taskLog, setTaskLog] = useState([]);

  const loadWorkspaceData = async () => {
    try {
      const [staffResponse, projectResponse] = await Promise.all([api.getStaff(), api.getProjects()]);
      setStaffLists(normalizeStaffLists(staffResponse.staff, projectResponse.projects));
    } catch {
      setStaffLists(fallbackStaffLists);
    }
  };

  const loadUserTasks = async () => {
    try {
      const response = await api.getTasks();
      setTaskLog(response.tasks || []);
    } catch {
      setTaskLog([]);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      if (!hasAuthToken()) {
        await loadWorkspaceData();
        setIsRestoringSession(false);
        return;
      }

      try {
        const response = await api.getMe();
        setUser(response.user);
        setLoginError(false);
        await loadWorkspaceData();
        await loadUserTasks();
        const nextView = cachedSession?.view || (response.user.role === 'Admin' ? 'admin-dashboard' : 'dashboard');
        setView(nextView);
        saveSessionCache(response.user, nextView);
      } catch {
        clearAuthToken();
        clearSessionCache();
        await loadWorkspaceData();
        setView('login');
      } finally {
        setIsRestoringSession(false);
      }
    };

    restoreSession();
  }, []);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setLoginError(false);

    if (selectedRole === 'Admin') {
      setEmail(adminCredentials.email);
      setPassword(adminCredentials.password);
      return;
    }

    if (email === adminCredentials.email) setEmail('');
    if (password === adminCredentials.password) setPassword('');
  };

  const handleViewChange = (nextView) => {
    if (nextView === 'login') {
      clearAuthToken();
      clearSessionCache();
      setUser(null);
    } else if (user) {
      saveSessionCache(user, nextView);
    }
    setView(nextView);
  };

  const handleLogin = async (event) => {
    event?.preventDefault();
    try {
      const response = await api.login({ email, password, role });
      saveAuthToken(response.token);
      setUser(response.user);
      setLoginError(false);
      await loadWorkspaceData();
      await loadUserTasks();
      const nextView = response.user.role === 'Admin' ? 'admin-dashboard' : 'dashboard';
      saveSessionCache(response.user, nextView);
      setView(nextView);
    } catch {
      setLoginError(true);
    }
  };

  const handleRegister = async (formData) => {
    try {
      const response = await api.register(formData);
      saveAuthToken(response.token);
      setUser(response.user);
      saveSessionCache(response.user, 'dashboard');
      setView('dashboard');
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  };

  const handleAddStaff = async (payload) => {
    try {
      const response = await api.createStaff(payload);
      setStaffLists((prev) => ({
        ...prev,
        [payload.staffType]: [...prev[payload.staffType], response.staff]
      }));
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  };

  const handleDeleteStaff = async (id, type, emailToDelete) => {
    try {
      if (id) await api.deleteStaff(id);
      setStaffLists((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => (id ? item._id !== id : item.email !== emailToDelete))
      }));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddProject = async (payload) => {
    try {
      const response = await api.createProject(payload);
      setStaffLists((prev) => ({ ...prev, projects: [...prev.projects, response.project] }));
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  };

  const handlePunchToggle = () => {
    const now = new Date();
    const timeStr = getFormattedTime(now);
    const dateStr = getFormattedDate(now);

    if (!isPunchedIn) {
      setPunchInTimeStr(timeStr);
      setPunchInDate(dateStr);
      setPunchOutTimeStr(null);
      setPunchOutDate(null);
      setIsPunchedIn(true);
      return;
    }

    if (activeTask) handleCancelTask();
    setPunchOutTimeStr(timeStr);
    setPunchOutDate(dateStr);
    setIsPunchedIn(false);
  };

  const handleStartTask = () => {
    if (!taskId || !project || !screenshot) return;
    setTaskStartTime(Date.now());
    setActiveTask(true);
  };

  const createTaskLog = async (status) => {
    if (!taskStartTime) return;
    const selectedProject = staffLists.projects.find((item) => item.id === project || item._id === project);
    const diffInSecs = Math.floor((Date.now() - taskStartTime) / 1000);
    const entry = {
      taskId,
      project: selectedProject?._id,
      projectName: selectedProject?.name,
      screenshot,
      status,
      submissionTime: getFormattedTime(),
      duration: formatDuration(diffInSecs),
      durationInSeconds: diffInSecs,
      justification: status === 'Completed' ? justification : 'N/A'
    };

    try {
      const response = await api.createTask(entry);
      setTaskLog((prev) => [...prev, response.task]);
    } catch {
      setTaskLog((prev) => [...prev, entry]);
    }
    resetTaskContext();
  };

  const handleSubmitTask = () => createTaskLog('Completed');
  const handleCancelTask = () => createTaskLog('Cancelled');

  const resetTaskContext = () => {
    setActiveTask(null);
    setTaskStartTime(null);
    setTaskId('');
    setProject('');
    setScreenshot(null);
    setJustification('');
  };

  if (isRestoringSession) {
    return (
      <div className="app-shell">
        <div className="auth-page">
          <div className="auth-card">
            <div className="logo-row">
              <div className="logo-mark">TT</div>
              <div>
                <h1>Task Track</h1>
                <p className="muted">Checking session...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {view === 'login' && (
        <LoginView
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          role={role}
          setRole={handleRoleChange}
          loginError={loginError}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          handleLogin={handleLogin}
          setView={handleViewChange}
        />
      )}

      {view === 'register' && (
        <RegisterView
          setView={handleViewChange}
          reviewers={staffLists.reviewers}
          leads={staffLists.leads}
          taskers={staffLists.taskers}
          onRegister={handleRegister}
        />
      )}

      {view === 'admin-dashboard' && (
        <AdminDashboardView
          setView={handleViewChange}
          staffLists={staffLists}
          setStaffLists={setStaffLists}
          onAddStaff={handleAddStaff}
          onDeleteStaff={handleDeleteStaff}
          onAddProject={handleAddProject}
        />
      )}

      {view === 'dashboard' && (
        <DashboardView
          user={user}
          isPunchedIn={isPunchedIn}
          punchInTimeStr={punchInTimeStr}
          punchOutTimeStr={punchOutTimeStr}
          punchInDate={punchInDate}
          punchOutDate={punchOutDate}
          handlePunchToggle={handlePunchToggle}
          setView={handleViewChange}
          taskId={taskId}
          setTaskId={setTaskId}
          project={project}
          setProject={setProject}
          screenshot={screenshot}
          setScreenshot={setScreenshot}
          activeTask={activeTask}
          handleStartTask={handleStartTask}
          handleSubmitTask={handleSubmitTask}
          handleCancelTask={handleCancelTask}
          taskLog={taskLog}
          staffLists={staffLists}
          justification={justification}
          setJustification={setJustification}
        />
      )}
    </div>
  );
};

export default App;
