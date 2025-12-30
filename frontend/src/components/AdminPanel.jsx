import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Render URL
  const API_URL = 'https://purple-merit-assessment-mhks.onrender.com/api/users/';

  // Fetch Users with Page Number
  const fetchUsers = async (pageNumber = 1) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user ? user.token : null;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Query param me page number bhejo
      const response = await axios.get(`${API_URL}?pageNumber=${pageNumber}`, config);
      
      // Backend ab { users, page, pages } bhej raha hai
      if (response.data.users) {
        setUsers(response.data.users);
        setPage(response.data.page);
        setTotalPages(response.data.pages);
      } else {
        // Fallback agar purana backend response ho
        setUsers(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch users');
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

      await axios.put(API_URL + id, { status: newStatus }, config);
      toast.success(`User marked as ${newStatus}`);
      fetchUsers(page); // Current page refresh karo
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
        fetchUsers(page);
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  // Page Load hone par fetch karo
  useEffect(() => {
    fetchUsers(page);
  }, [page]); // Jab page state badle, tab fetch karo

  return (
    <div style={{ marginTop: '20px', overflowX: 'auto' }}>
      <h3>All Registered Users (Page {page} of {totalPages})</h3>
      
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
              <td style={{ padding: '10px' }}>
                <button 
                  onClick={() => toggleUserStatus(user._id, user.status || 'active')}
                  style={{ 
                    background: user.status === 'inactive' ? 'green' : 'orange', 
                    color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '5px', marginRight: '10px' 
                  }}
                >
                  {user.status === 'inactive' ? 'Activate' : 'Deactivate'}
                </button>
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

      {/* --- PAGINATION BUTTONS --- */}
      {totalPages > 1 && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button 
            onClick={() => setPage(page - 1)} 
            disabled={page === 1}
            style={{ padding: '8px 15px', cursor: page === 1 ? 'not-allowed' : 'pointer', background: '#333', color: 'white', border: 'none', opacity: page === 1 ? 0.5 : 1 }}
          >
            Previous
          </button>
          
          <span style={{ padding: '8px' }}>Page {page} of {totalPages}</span>
          
          <button 
            onClick={() => setPage(page + 1)} 
            disabled={page === totalPages}
            style={{ padding: '8px 15px', cursor: page === totalPages ? 'not-allowed' : 'pointer', background: '#333', color: 'white', border: 'none', opacity: page === totalPages ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;