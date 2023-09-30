
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/register', {
        email,
        password,
      });

      if (response.status === 201) {

        localStorage.setItem('token', response.data.token);
        setIsRegistered(true);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };


  if (isRegistered) {
    return (
      <div className='container mt-5'>
        <div className='row justify-content-center'>
          <div className='col-md-6 col-sm-12'>
            <div className='card shadow'>
              <div className='card-body'>
                <h2 className='card-title text-center mb-4 fw-bold'>
                  Registration Successful
                </h2>
                <p className='text-center'>
                  Your registration was successful. Please{' '}
                  <Link to="/dashboard">Click</Link> to access your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6 col-sm-12'>
          <div className='card shadow'>
            <div className='card-body'>
              <h2 className='card-title text-center mb-4 fw-bold'>Register</h2>
              {error && <p className='alert alert-danger'>{error}</p>}
              <form onSubmit={handleRegister}>
                <div className='mb-3'>
                  <input
                    type="email"
                    className='form-control'
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='mb-3'>
                  <input
                    type="password"
                    className='form-control'
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;


