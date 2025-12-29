import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../features/authService'; // Service import kiya

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    // Check karo agar user pehle se login hai (LocalStorage mein data hai)
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/'); // Dashboard par bhej do
    }
  }, [navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        email,
        password,
      };

      // Backend ko Login request bhejo
      await authService.login(userData);
      
      // Success hone par dashboard bhejo
      navigate('/');
      window.location.reload(); // Header update karne ke liye

    } catch (error) {
      // Error handling
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };

  return (
    <>
      <section className='heading'>
        <h1>
           Login
        </h1>
        <p>Login and start managing users</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Login;