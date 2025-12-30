import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 👇 YE LINE IMPORT HONI CHAHIYE
import AdminPanel from '../components/AdminPanel'; 

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    _id: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '20px' }}>
      
      <section className='heading'>
        <h1>Welcome, {user.fullName || user.name || "User"} 👋</h1>
        <p>User Dashboard</p>
      </section>

      {/* User Info Table */}
      <div className="profile-card" style={{ maxWidth: '600px', margin: '20px auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left' }}>ID</th>
              <td style={{ padding: '15px', textAlign: 'left' }}>{user._id || user.id}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left' }}>Full Name</th>
              <td style={{ padding: '15px', textAlign: 'left' }}>{user.fullName || user.name}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left' }}>Email</th>
              <td style={{ padding: '15px', textAlign: 'left' }}>{user.email}</td>
            </tr>
            <tr>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left' }}>Role</th>
              <td style={{ padding: '15px', textAlign: 'left' }}>
                <span style={{ 
                  backgroundColor: (user.role === 'admin') ? 'red' : 'green',
                  color: 'white', 
                  padding: '5px 12px', 
                  borderRadius: '20px'
                }}>
                  {user.role ? user.role.toUpperCase() : 'USER'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 👇 YE HAI MAGIC PART: ADMIN PANEL */}
      {user.role === 'admin' ? (
        <div style={{ marginTop: '30px', padding: '20px', borderTop: '2px solid #eee' }}>
          <h3 style={{color: 'red'}}>🔧 Admin Panel Active</h3>
          <p>Manage all users below:</p>
          
          {/* Component ab dikhega */}
          <AdminPanel />
          
        </div>
      ) : (
        <div style={{ marginTop: '30px', color: 'gray' }}>
          <p>You are a standard user.</p>
        </div>
      )}

    </div>
  );
}

export default Dashboard;