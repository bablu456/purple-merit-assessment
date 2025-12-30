import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// AdminPanel import ko uncomment karo agar tumhare paas component hai
// import AdminPanel from '../components/AdminPanel'; 

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    _id: ''
  });

  useEffect(() => {
    // 1. Browser se data nikalo
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      // Agar data nahi hai, to Login par bhejo
      navigate('/login');
    } else {
      // 2. Data ko JSON mein convert karke State mein set karo
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, [navigate]);

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '20px' }}>
      
      {/* HEADER SECTION */}
      <section className='heading'>
        <h1>Welcome, {user.fullName || user.name || "User"} 👋</h1>
        <p>User Dashboard</p>
      </section>

      {/* DATA TABLE */}
      <div className="profile-card" style={{ 
        maxWidth: '600px', 
        margin: '20px auto', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
        borderRadius: '10px', 
        overflow: 'hidden' 
      }}>
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            
            {/* ID */}
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left' }}>ID</th>
              <td style={{ padding: '15px', textAlign: 'left' }}>{user._id || user.id || "Loading..."}</td>
            </tr>

            {/* FULL NAME */}
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left' }}>Full Name</th>
              <td style={{ padding: '15px', textAlign: 'left' }}>{user.fullName || user.name || "Checking..."}</td>
            </tr>

            {/* EMAIL */}
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left' }}>Email</th>
              <td style={{ padding: '15px', textAlign: 'left' }}>{user.email || "Checking..."}</td>
            </tr>

            {/* ROLE */}
            <tr>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left' }}>Role</th>
              <td style={{ padding: '15px', textAlign: 'left' }}>
                <span style={{ 
                  backgroundColor: (user.role === 'admin') ? 'red' : 'green',
                  color: 'white',
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

      {/* ADMIN PANEL CHECK */}
      {/* Yahan check kar rahe hain ki kya user ADMIN hai? */}
      {user.role === 'admin' ? (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{color: 'red'}}>🔧 Admin Panel Active</h3>
          {/* <AdminPanel />  <-- Agar component ready hai to uncomment kar dena */}
          <p>You have full access to manage users.</p>
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