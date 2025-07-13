import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setError(null);
      setLoading(false);
      navigate('/sign-in');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4 fw-semibold">Sign Up</h2>

        <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white d-flex flex-column gap-3">
          <input
            type="text"
            placeholder="Username"
            className="form-control"
            id="username"
            onChange={handleChange}
            value={formData.username}
          />
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-dark w-100"
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>

          {error && (
            <div className="alert alert-danger text-center mb-0 mt-2 py-2">
              {error}
            </div>
          )}
        </form>

        <div className="text-center mt-4">
          <p className="mb-1">Have an account?</p>
          <Link to="/sign-in" className="text-decoration-none fw-medium" style={{ color: '#0d6efd' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
