import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4 fw-semibold">Sign In</h2>

        <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white d-flex flex-column gap-3">
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            id="email"
            onChange={handleChange}
            value={formData.email}
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control"
            id="password"
            onChange={handleChange}
            value={formData.password}
          />

          <button type="submit" disabled={loading} className="btn btn-dark w-100">
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <OAuth/>

          {error && (
            <div className="alert alert-danger text-center mb-0 mt-2 py-2">
              {error}
            </div>
          )}
        </form>

        <div className="text-center mt-4">
          <p className="mb-1">Don't have an account?</p>
          <Link to="/sign-up" className="text-decoration-none fw-medium" style={{ color: '#0d6efd' }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
