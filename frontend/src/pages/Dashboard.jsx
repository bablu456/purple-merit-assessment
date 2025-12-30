import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios import zaroori hai update ke liye
import { toast } from 'react-toastify';
import AdminPanel from '../components/AdminPanel'; 

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '' // Optional change
  });

  // Render URL (Backend)
  const API_URL = 'https://purple-merit-assessment-mhks.onrender.com/api/users/';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        password: ''
      });
    }
  }, [navigate]);

  // Update Handle Function
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Request bhej rahe hain '/profile' route par
      const res = await axios.put(API_URL + 'profile', formData, config);
      
      // LocalStorage Update karo
      const updatedUser = { ...user, ...res.data, token: token }; // Token purana hi rakho
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setIsEditing(false);
      toast.success('Profile Updated Successfully!');
    } catch (error) {
      toast.error('Update Failed! Try different email.');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '20px' }}>
      
      <section className='heading'>
        <h1 style={{ color: '#333' }}>Welcome, {user.name} 👋</h1>
        <p style={{ color: '#666' }}>
           {/* 👇 TIME STAMP DISPLAY */}
           Last Login: {new Date(user.lastLogin || Date.now()).toLocaleString()}
        </p>
      </section>

      {/* Edit Form Toggle */}
      <button 
        onClick={() => setIsEditing(!isEditing)}
        style={{ margin: '10px', padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
      </button>

      {/* EDIT FORM (Sirf tab dikhega jab Edit button dabaya ho) */}
      {isEditing && (
        <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', background: '#f9f9f9' }}>
          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '10px' }}>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input 
                type="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input 
                type="password" 
                placeholder="New Password (Optional)" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <button type="submit" style={{ padding: '8px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Profile Details Table */}
      <div className="profile-card" style={{ maxWidth: '600px', margin: '20px auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '10px', backgroundColor: 'white' }}>
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left', color: '#333' }}>ID</th>
              <td style={{ padding: '15px', textAlign: 'left', color: '#555' }}>{user._id}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left', color: '#333' }}>Full Name</th>
              <td style={{ padding: '15px', textAlign: 'left', color: '#555' }}>{user.name}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left', color: '#333' }}>Email</th>
              <td style={{ padding: '15px', textAlign: 'left', color: '#555' }}>{user.email}</td>
            </tr>
            <tr>
              <th style={{ padding: '15px', background: '#f8f9fa', textAlign: 'left', color: '#333' }}>Role</th>
              <td style={{ padding: '15px', textAlign: 'left' }}>
                <span style={{ backgroundColor: user.role === 'admin' ? 'red' : 'green', color: 'white', padding: '5px 12px', borderRadius: '20px' }}>
                  {user.role}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ADMIN PANEL */}
      {user.role === 'admin' && (
        <div style={{ marginTop: '30px', padding: '20px', borderTop: '2px solid #eee' }}>
          <h3 style={{color: '#d9534f'}}>🔧 Admin Panel Active</h3>
          <AdminPanel />
        </div>
      )}

    </div>
  );
}

export default Dashboard;