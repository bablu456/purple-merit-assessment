import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminPanel from '../components/AdminPanel'; // Import zaroori hai

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    // 1. Check karo user login hai ya nahi
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      navigate('/login');
    } else {
      setToken(user.token); // Token save kiya AdminPanel ke liye
      fetchUserProfile(user.token);
    }
  }, [navigate]);

  const fetchUserProfile = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('/api/users/profile', config);
      setUserData(response.data);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch profile');
    }
  };

  if (!userData) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <section className='heading'>
        <h1>Welcome, {userData.fullName} 👋</h1>
        <p>User Dashboard</p>
      </section>

      <div className='content'>
        {/* User Profile Info */}
        <table className='table' style={{ marginBottom: '30px' }}>
          <tbody>
            <tr>
              <th>ID</th>
              <td>{userData._id}</td>
            </tr>
            <tr>
              <th>Full Name</th>
              <td>{userData.fullName}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{userData.email}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>
                {/* SAFE CODE: Agar role nahi mila to crash nahi hoga */}
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

        {/* --- ADMIN SECTION --- */}
        {/* Agar User Admin hai, tabhi ye Panel dikhega */}
        {userData.role === 'admin' && <AdminPanel token={token} />}
      
      </div>
    </>
  );
}

export default Dashboard;