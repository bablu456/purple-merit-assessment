import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import userService from '../features/userService';

function AdminPanel({ token }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Users Load karne ka function
  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers(token, page);
      setUsers(data.users);
      setPage(data.page);
      setTotalPages(data.pages);
    } catch (error) {
      toast.error('Error fetching users');
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); 

  // User Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id, token);
        toast.success('User Deleted');
        loadUsers(); // List refresh karo
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  // Toggle Status (Active/Inactive)
  const toggleStatus = async (user) => {
      try {
          const newStatus = user.status === 'active' ? 'inactive' : 'active';
          await userService.updateUserStatus(user._id, newStatus, token);
          toast.success(`User marked as ${newStatus}`);
          loadUsers();
      } catch (error) {
          toast.error('Failed to update status');
      }
  }

  return (
    <div style={{ marginTop: '30px', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Admin Panel - User Management</h2>
      
      <div style={{ overflowX: 'auto' }}>
        <table className='table'>
            <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                    <span style={{ 
                        color: user.status === 'active' ? 'green' : 'red',
                        fontWeight: 'bold' 
                    }}>
                        {user.status.toUpperCase()}
                    </span>
                </td>
                <td>
                    <button 
                        className='btn' 
                        style={{ backgroundColor: '#ffc107', color: 'black', marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                        onClick={() => toggleStatus(user)}
                    >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>

                    <button 
                        className='btn' 
                        style={{ backgroundColor: 'red', padding: '5px 10px', fontSize: '12px' }}
                        onClick={() => handleDelete(user._id)}
                    >
                        Delete
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
          <button 
            className='btn' 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
            style={{ opacity: page === 1 ? 0.5 : 1 }}
          >
              Previous
          </button>
          
          <span style={{ fontWeight: 'bold' }}> Page {page} of {totalPages} </span>
          
          <button 
            className='btn' 
            disabled={page === totalPages} 
            onClick={() => setPage(page + 1)}
            style={{ opacity: page === totalPages ? 0.5 : 1 }}
          >
              Next
          </button>
      </div>
    </div>
  );
}

export default AdminPanel;