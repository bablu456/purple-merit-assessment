import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../features/authService';

function Header() {
  const navigate = useNavigate();
  
  // Check karo user login hai ya nahi
  const user = JSON.parse(localStorage.getItem('user'));

  const onLogout = () => {
    // 1. LocalStorage saaf karo
    authService.logout();
    // 2. Login page par bhejo
    navigate('/login');
    // 3. Page reload karo taaki sab reset ho jaye
    window.location.reload();
  };

  return (
    <header className='header'>
      <div className='container'>
        <div className='logo'>
          <Link to='/'>PurpleMerit</Link>
        </div>
        <ul>
          {user ? (
            // AGAR LOGIN HAI TOH YE DIKHEGA
            <>
              <li>
                <span style={{ fontWeight: 'bold', marginRight: '15px' }}>
                   User: {user.fullName}
                </span>
              </li>
              <li>
                <button 
                  className='btn' 
                  onClick={onLogout}
                  style={{ backgroundColor: 'red', border: 'none' }}
                >
                   Logout
                </button>
              </li>
            </>
          ) : (
            // AGAR LOGOUT HAI TOH YE DIKHEGA
            <>
              <li>
                <Link to='/login'>
                   Login
                </Link>
              </li>
              <li>
                <Link to='/register'>
                   Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  )
}

export default Header