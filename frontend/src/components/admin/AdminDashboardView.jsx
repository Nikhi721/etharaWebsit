import { memo, useState } from 'react';
import { ExternalLink, Layout, LogOut, Mail, Plus, ShieldCheck, UserPlus, X } from 'lucide-react';
import '../../styles/admin.css';

const AdminDashboardView = memo(({ setView, staffLists, setStaffLists, onAddStaff, onDeleteStaff, onAddProject }) => {
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffType, setStaffType] = useState('leads');
  const [assignedLead, setAssignedLead] = useState('');
  const [assignedReviewer, setAssignedReviewer] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDuration, setProjectDuration] = useState('');

  const handleAddStaff = async (event) => {
    event.preventDefault();
    if (!staffEmail.trim()) return;
    const created = await onAddStaff({
      name: staffName.trim(),
      email: staffEmail.trim(),
      staffType,
      assignedLead,
      assignedReviewer
    });
    if (!created) return;
    setStaffName('');
    setStaffEmail('');
    setAssignedLead('');
    setAssignedReviewer('');
  };

  const handleAddProject = async (event) => {
    event.preventDefault();
    if (!projectName.trim() || !projectDuration) return;
    const created = await onAddProject({ name: projectName.trim(), duration: `${projectDuration}m` });
    if (!created) return;
    setProjectName('');
    setProjectDuration('');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand"><div className="logo-mark small">TT</div><span>Admin Panel</span></div>
        <nav><button className="side-link active"><ShieldCheck size={18} /> Management</button></nav>
        <button onClick={() => setView('login')} className="side-link logout"><LogOut size={18} /> Log Out</button>
      </aside>

      <main className="admin-main custom-scrollbar">
        <header className="admin-header">
          <div>
            <h2>Organization Control</h2>
            <p>Configure staff hierarchy and projects</p>
          </div>
          <button onClick={() => setView('dashboard')} className="primary-button">
            Go to Tasker Dashboard <ExternalLink size={16} />
          </button>
        </header>

        <div className="admin-grid">
          <section className="admin-stack">
            <div className="panel">
              <h3><UserPlus size={20} /> Authorize Staff</h3>
              <form className="admin-form" onSubmit={handleAddStaff}>
                <label>Staff Role</label>
                <select value={staffType} onChange={(event) => setStaffType(event.target.value)} className="select">
                  <option value="leads">Project Lead</option>
                  <option value="reviewers">Quality Reviewer</option>
                  <option value="taskers">Tasker</option>
                </select>

                <input className="field" value={staffName} onChange={(event) => setStaffName(event.target.value)} placeholder="Full Name" required />

                {(staffType === 'reviewers' || staffType === 'taskers') && (
                  <select value={assignedLead} onChange={(event) => setAssignedLead(event.target.value)} className="select" required>
                    <option value="">Assign Project Lead</option>
                    {staffLists.leads.map((lead) => <option key={lead.email} value={lead.name}>{lead.name}</option>)}
                  </select>
                )}

                {staffType === 'taskers' && (
                  <select value={assignedReviewer} onChange={(event) => setAssignedReviewer(event.target.value)} className="select" required>
                    <option value="">Assign Quality Reviewer</option>
                    {staffLists.reviewers.map((reviewer) => <option key={reviewer.email} value={reviewer.name}>{reviewer.name}</option>)}
                  </select>
                )}

                <input className="field" type="email" value={staffEmail} onChange={(event) => setStaffEmail(event.target.value)} placeholder="Member Email ID" required />
                <button className="primary-button full-width" type="submit"><Plus size={18} /> Authorize Entry</button>
              </form>
            </div>

            <div className="panel">
              <h3><Layout size={20} /> Create New Project</h3>
              <form className="project-form" onSubmit={handleAddProject}>
                <input className="field" value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="Project Name" required />
                <input className="field" type="number" value={projectDuration} onChange={(event) => setProjectDuration(event.target.value)} placeholder="Duration (min)" required />
                <button className="secondary-button full-width" type="submit">Deploy Project</button>
              </form>
            </div>
          </section>

          <section className="panel staff-list-panel">
            <h3 className="list-title">Authorized Staff List</h3>
            <div className="staff-list custom-scrollbar">
              {['leads', 'reviewers', 'taskers'].map((type) => staffLists[type].map((staff) => (
                <article key={staff._id || staff.email} className="staff-row">
                  <div>
                    <div className="staff-name-row">
                      <span className={`staff-badge ${type}`}>{type.slice(0, -1)}</span>
                      <strong>{staff.name}</strong>
                    </div>
                    <p><Mail size={12} /> {staff.email}</p>
                  </div>
                  <button onClick={() => onDeleteStaff(staff._id, type, staff.email)} className="delete-button" aria-label="Delete staff"><X size={16} /></button>
                </article>
              )))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
});

export default AdminDashboardView;
