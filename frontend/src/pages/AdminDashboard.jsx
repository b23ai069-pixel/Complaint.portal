import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('/api/complaints/all');
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to fetch complaints', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.patch(`/api/complaints/${id}/status`, { status: newStatus });
      setComplaints(complaints.map(c => c._id === id ? res.data : c));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Pending') return 'status-pending';
    if (status === 'In Progress') return 'status-progress';
    if (status === 'Resolved') return 'status-resolved';
    return '';
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">Complaint Portal <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--primary-color)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginLeft: '0.5rem' }}>ADMIN</span></div>
        <div className="nav-links">
          <span className="user-info">Logged in as {user?.name} (Admin)</span>
          <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>Logout</button>
        </div>
      </nav>

      <div className="glass-card">
        <h2 className="title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>All System Complaints</h2>
        
        {loading ? (
             <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        ) : complaints.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No complaints found in the system.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Date</th>
                  <th>User</th>
                  <th>Complaint Details</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c._id}>
                    <td><strong style={{ color: 'var(--primary-color)' }}>{c.trackingId}</strong></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div>{c.userId?.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.userId?.email}</div>
                    </td>
                    <td>
                      <strong>{c.title}</strong>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {c.description}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(c.status)}`}>{c.status}</span>
                    </td>
                    <td>
                      <select 
                        className="form-input" 
                        style={{ padding: '0.4rem 2rem 0.4rem 0.5rem', fontSize: '0.9rem', marginBottom: 0 }}
                        value={c.status} 
                        onChange={(e) => updateStatus(c._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminDashboard;
