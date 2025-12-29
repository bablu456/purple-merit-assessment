import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AdminPanel from '../components/AdminPanel'; // Make sure path sahi ho

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Data seedha LocalStorage se uthao (Sabse Safe Tarika)
  const user = JSON.parse(localStorage.getItem('user'));
  const userData = user || {};

  useEffect(() => {
    // Agar user login nahi hai to Login page par bhejo
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <>
      <section className='heading'>
        <h1>Welcome, {userData.name || userData.fullName || 'User'}</h1>
        <p>User Dashboard</p>
      </section>

      {/* Profile Details Table */}
      <div className="profile-card" style={{margin: '20px auto', maxWidth: '600px', textAlign: 'left'}}>
        <table className="table" style={{width: '100%', borderCollapse: 'collapse'}}>
          <tbody>
            <tr>
              <th style={{borderBottom: '1px solid #ddd', padding: '10px'}}>ID</th>
              <td style={{borderBottom: '1px solid #ddd', padding: '10px'}}>{userData._id || userData.id}</td>
            </tr>
            <tr>
              <th style={{borderBottom: '1px solid #ddd', padding: '10px'}}>Full Name</th>
              <td style={{borderBottom: '1px solid #ddd', padding: '10px'}}>{userData.name || userData.fullName}</td>
            </tr>
            <tr>
              <th style={{borderBottom: '1px solid #ddd', padding: '10px'}}>Email</th>
              <td style={{borderBottom: '1px solid #ddd', padding: '10px'}}>{userData.email}</td>
            </tr>
            <tr>
              <th style={{borderBottom: '1px solid #ddd', padding: '10px'}}>Role</th>
              <td style={{borderBottom: '1px solid #ddd', padding: '10px'}}>
                <span style={{ 
                  backgroundColor: (userData.role === 'admin') ? 'red' : 'green',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '5px'
                }}>
                  {userData.role ? userData.role.toUpperCase() : 'USER'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. Admin Panel Sirf tab dikhao jab Role 'admin' ho */}
      {userData.role === 'admin' ? (
        <AdminPanel />
      ) : (
        <h3 style={{marginTop: '50px', color: 'gray'}}>You are not an Admin</h3>
      )}
    </>
  );
}

export default Dashboard;