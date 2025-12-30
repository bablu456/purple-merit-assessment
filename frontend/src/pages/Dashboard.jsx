import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        {/* Iska color bhi dark kar diya */}
        <h1 style={{ color: '#333' }}>Welcome, {user.fullName || user.name || "User"} 👋</h1>
        <p style={{ color: '#666' }}>User Dashboard</p>
      </section>

      <div className="profile-card" style={{ 
        maxWidth: '600px', 
        margin: '20px auto', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
        borderRadius: '10px', 
        overflow: 'hidden',
        backgroundColor: 'white' // Background white ensure kiya
      }}>
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            
            {/* ID ROW */}
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left', color: '#333', fontWeight: 'bold' }}>ID</th>
              <td style={{ padding: '15px', textAlign: 'left', color: '#555' }}>{user._id || user.id}</td>
            </tr>

            {/* FULL NAME ROW */}
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left', color: '#333', fontWeight: 'bold' }}>Full Name</th>
              <td style={{ padding: '15px', textAlign: 'left', color: '#555' }}>{user.fullName || user.name}</td>
            </tr>

            {/* EMAIL ROW */}
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left', color: '#333', fontWeight: 'bold' }}>Email</th>
              <td style={{ padding: '15px', textAlign: 'left', color: '#555' }}>{user.email}</td>
            </tr>

            {/* ROLE ROW */}
            <tr>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left', color: '#333', fontWeight: 'bold' }}>Role</th>
              <td style={{ padding: '15px', textAlign: 'left' }}>
                <span style={{ 
                  backgroundColor: (user.role === 'admin') ? 'red' : 'green',
                  color: 'white', // Box ke andar text white hi rahega
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {user.role ? user.role.toUpperCase() : 'USER'}
                </span>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* Admin Panel Section */}
      {user.role === 'admin' ? (
        <div style={{ marginTop: '30px', padding: '20px', borderTop: '2px solid #eee' }}>
          <h3 style={{color: '#d9534f'}}>🔧 Admin Panel Active</h3>
          <p style={{color: '#333'}}>Manage all users below:</p>
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