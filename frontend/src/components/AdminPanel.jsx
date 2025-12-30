import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  
  // Render URL (Ensure ye sahi ho)
  const API_URL = 'https://purple-merit-assessment-mhks.onrender.com/api/users/';

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user ? user.token : null;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.get(API_URL, config);
      if (response.data.users) {
        setUsers(response.data.users);
      } else {
        setUsers(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- NEW: TOGGLE STATUS FUNCTION ---
  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Agar active hai to inactive karo, aur vice-versa
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

      await axios.put(API_URL + id, { status: newStatus }, config);
      
      toast.success(`User marked as ${newStatus}`);
      fetchUsers(); // List refresh karo
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        await axios.delete(API_URL + id, config);
        toast.success('User Deleted');
        fetchUsers();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

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
            <th style={{ padding: '10px' }}>Status</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{user.name || user.fullName}</td>
              <td style={{ padding: '10px' }}>{user.email}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ color: user.role === 'admin' ? 'red' : 'green', fontWeight: 'bold' }}>
                    {user.role}
                </span>
              </td>
              
              {/* STATUS COLUMN */}
              <td style={{ padding: '10px' }}>
                <span style={{ 
                  backgroundColor: user.status === 'inactive' ? '#ffcc00' : '#c3e6cb',
                  padding: '5px 10px',
                  borderRadius: '10px',
                  color: user.status === 'inactive' ? 'black' : 'green',
                  fontWeight: 'bold'
                }}>
                  {user.status || 'active'}
                </span>
              </td>

              {/* ACTION BUTTONS */}
              <td style={{ padding: '10px' }}>
                {/* Status Toggle Button */}
                <button 
                  onClick={() => toggleUserStatus(user._id, user.status || 'active')}
                  style={{ 
                    background: user.status === 'inactive' ? 'green' : 'orange', 
                    color: 'white', 
                    border: 'none', 
                    padding: '5px 10px', 
                    cursor: 'pointer', 
                    borderRadius: '5px',
                    marginRight: '10px'
                  }}
                >
                  {user.status === 'inactive' ? 'Activate' : 'Deactivate'}
                </button>

                {/* Delete Button */}
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