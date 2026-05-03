import { memo, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeftRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  FileCheck,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Play,
  Square,
  Timer,
  TrendingUp,
  Upload,
  UserCircle,
  X
} from 'lucide-react';
import LiveTimer from './LiveTimer.jsx';
import { formatDuration, getFormattedDate } from '../../utils/time.js';
import '../../styles/dashboard.css';

const DashboardView = memo(({
  user,
  isPunchedIn,
  punchInTimeStr,
  punchOutTimeStr,
  punchInDate,
  punchOutDate,
  handlePunchToggle,
  setView,
  taskId,
  setTaskId,
  project,
  setProject,
  screenshot,
  setScreenshot,
  activeTask,
  handleStartTask,
  handleSubmitTask,
  handleCancelTask,
  taskLog,
  staffLists,
  justification,
  setJustification
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const stats = useMemo(() => {
    const completedTasks = taskLog.filter((task) => task.status === 'Completed');
    const totalDurationSeconds = completedTasks.reduce((acc, task) => acc + (task.durationInSeconds || 0), 0);
    const average = completedTasks.length > 0 ? Math.round(totalDurationSeconds / completedTasks.length) : 0;
    return {
      completedCount: completedTasks.length,
      totalDurationSeconds,
      average
    };
  }, [taskLog]);

  const selectedProject = staffLists.projects.find((item) => item.id === project || item._id === project);

  const readImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setScreenshot(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="dashboard-layout">
      <div className={`drawer-backdrop ${isSidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="drawer-head">
          <div className="logo-row drawer-logo"><div className="logo-mark">TT</div><span>Task Forge</span></div>
          <button className="icon-button" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>

        <div className="profile-strip">
          <div className="avatar"><UserCircle size={48} /></div>
          <div>
            <strong>{user?.name || 'NIKHIL'}</strong>
            <p>{user?.role}</p>
          </div>
        </div>

        <nav className="dashboard-nav">
          <button className="nav-item active"><LayoutDashboard size={20} /> My Dashboard</button>
          <button className="nav-item"><ClipboardList size={20} /> Activity Logs</button>
          {user?.role === 'Admin' && (
            <button onClick={() => setView('admin-dashboard')} className="nav-item admin-return">
              <ArrowLeftRight size={20} /> Return to Admin
            </button>
          )}
        </nav>

        <button onClick={() => setView('login')} className="nav-item logout"><LogOut size={20} /> Logout</button>
      </aside>

      <main className="dashboard-main custom-scrollbar">
        <header className="dashboard-header">
          <button onClick={() => setSidebarOpen(true)} className="menu-button"><Menu size={26} /></button>
          <div>
            <h2>My Dashboard</h2>
            <p>Welcome back, {user?.name || 'NIKHIL'}</p>
          </div>
        </header>

        {!isPunchedIn && (
          <div className="notice">
            <AlertCircle size={22} />
            <p>You haven't punched in yet. You must punch in before starting tasks.</p>
          </div>
        )}

        <section className="punch-panel">
          <div className="punch-content">
            <div className="timer-block">
              <p>Ready To Start</p>
              <h3><LiveTimer isActive={isPunchedIn} /></h3>
            </div>

            <div className="punch-cards">
              <div className="punch-card in">
                <p>Punch In</p>
                <strong>{punchInTimeStr || '-'}</strong>
                <span>{punchInDate ? `• ${punchInDate}` : '• N/A'}</span>
              </div>
              <div className="punch-card out">
                <p>Punch Out</p>
                <strong>{punchOutTimeStr || '-'}</strong>
                <span>{punchOutDate ? `• ${punchOutDate}` : `• ${getFormattedDate()}`}</span>
              </div>
            </div>

            <button onClick={handlePunchToggle} className={`punch-button ${isPunchedIn ? 'out' : ''}`}>
              {isPunchedIn ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              {isPunchedIn ? 'Punch Out' : 'Punch In'}
            </button>
          </div>

          <div className="assignment-strip">
            <div><p>Project Lead</p><strong>{staffLists.leads[0]?.name || 'Piyush Singh Tomar'}</strong></div>
            <div><p>Quality Reviewer</p><strong>{staffLists.reviewers[0]?.name || 'Sanyam Sehrawat'}</strong></div>
          </div>
        </section>

        <section className="stats-grid">
          <article className="stat-card"><div><p>Tasks Completed</p><strong>{stats.completedCount}</strong></div><CheckCircle2 size={40} /></article>
          <article className="stat-card"><div><p>Total Time</p><strong>{formatDuration(stats.totalDurationSeconds)}</strong></div><Clock size={40} /></article>
          <article className="stat-card"><div><p>Avg Task Time</p><strong>{formatDuration(stats.average)}</strong><span>AHT Metrics</span></div><TrendingUp size={40} /></article>
        </section>

        <section className="work-grid">
          <div className="work-panel">
            {activeTask ? (
              <div>
                <header className="active-task-head">
                  <div className="task-preview">
                    {screenshot && <img src={screenshot} alt="Task" />}
                  </div>
                  <div>
                    <h3>Task #{taskId}</h3>
                    <p>{selectedProject?.name}</p>
                  </div>
                  <div className="live-pill"><LiveTimer isActive /></div>
                </header>

                <label className="form-label">Justification</label>
                <textarea
                  value={justification}
                  onChange={(event) => setJustification(event.target.value)}
                  placeholder="Elaborate on work steps..."
                  className="textarea task-textarea"
                />
                <div className="task-actions">
                  <button onClick={handleSubmitTask} className="primary-button">Submit Project</button>
                  <button onClick={handleCancelTask} className="danger-button">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="section-title"><Play size={18} /> Start New Task</h3>
                <label className="form-label">Task Deployment ID *</label>
                <input disabled={!isPunchedIn} value={taskId} onChange={(event) => setTaskId(event.target.value)} placeholder="Enter Task ID" className="field" />

                <div className="label-row">
                  <label className="form-label">Select Target Project *</label>
                  <button type="button">+ Request Project</button>
                </div>
                <div className="select-wrap">
                  <select disabled={!isPunchedIn} value={project} onChange={(event) => setProject(event.target.value)} className="select">
                    <option value="">No project</option>
                    {staffLists.projects.map((item) => <option key={item.id || item._id} value={item.id || item._id}>{item.name} - {item.duration}</option>)}
                  </select>
                  <ChevronRight size={16} />
                </div>

                <label className="form-label image-label"><ImageIcon size={14} /> Upload Image *</label>
                <label className="upload-zone">
                  {screenshot ? <img src={screenshot} alt="Preview" /> : <span><Upload size={32} /> Click, paste, or drag and drop</span>}
                  <input type="file" accept="image/*" disabled={!isPunchedIn} onChange={(event) => readImage(event.target.files?.[0])} />
                </label>

                <button onClick={handleStartTask} disabled={!isPunchedIn || !taskId || !project || !screenshot} className="primary-button full-width">
                  <Play size={16} fill="white" /> Start Task
                </button>
              </div>
            )}
          </div>

          <div className="work-panel log-panel">
            <h3 className="log-title">Today's Task Log</h3>
            <div className="task-log custom-scrollbar">
              {taskLog.length === 0 ? (
                <div className="empty-log">
                  <FileCheck size={48} />
                  <strong>No tasks logged yet</strong>
                  <p>Start a task to begin tracking</p>
                </div>
              ) : [...taskLog].reverse().map((task) => (
                <article key={task._id || `${task.taskId}-${task.submissionTime}`} className="log-row">
                  <div className="log-main">
                    <div className="log-image">{task.screenshot ? <img src={task.screenshot} alt="Log" /> : <ImageIcon size={22} />}</div>
                    <div><strong>ID: {task.taskId}</strong><p>{task.projectName}</p></div>
                  </div>
                  <div className="log-meta">
                    <span className={task.status === 'Cancelled' ? 'cancelled' : ''}><Timer size={16} /> {task.duration}</span>
                    <p>{task.submissionTime}</p>
                    <em className={task.status === 'Cancelled' ? 'cancelled' : ''}>{task.status}</em>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
});

export default DashboardView;
