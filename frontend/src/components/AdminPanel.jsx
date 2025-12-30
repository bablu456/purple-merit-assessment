import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  
  // Naya API URL (Render wala)
  const API_URL = 'https://purple-merit-assessment-mhks.onrender.com/api/users/';

  // 1. Saare Users ko Fetch karo
  const fetchUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user ? user.token : null;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(API_URL, config);
      // Backend shayad { users: [...] } bhej raha ho ya direct array
      // Hum dono check kar lenge
      if (response.data.users) {
        setUsers(response.data.users);
      } else {
        setUsers(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch users');
    }
  };

  // 2. User ko Delete karne ka function
  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        await axios.delete(API_URL + id, config);
        toast.success('User Deleted');
        fetchUsers(); // List refresh karo
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ marginTop: '20px', overflowX: 'auto' }}>
      <h3>All Registered Users</h3>
      <table className="table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#333', color: '#fff' }}>
            <th style={{ padding: '10px' }}>Name</th>
            <th style={{ padding: '10px' }}>Email</th>
            <th style={{ padding: '10px' }}>Role</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{user.name || user.fullName}</td>
              <td style={{ padding: '10px' }}>{user.email}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ 
                    color: user.role === 'admin' ? 'red' : 'green', 
                    fontWeight: 'bold' 
                }}>
                    {user.role}
                </span>
              </td>
              <td style={{ padding: '10px' }}>
                <button 
                  onClick={() => deleteUser(user._id)}
                  style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '5px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;