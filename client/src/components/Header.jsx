import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-light shadow-sm border-bottom py-3">
      <div className="container-fluid d-flex justify-content-between align-items-center px-4">
        {/* Logo */}
        <Link to="/" className="text-decoration-none">
          <h1 className="fw-bold fs-5 mb-0">
            <span className="text-secondary">Sahand</span>
            <span className="text-dark">Estate</span>
          </h1>
        </Link>

        {/* Search bar */}
        <form  onSubmit={handleSubmit}
        className="d-none d-md-flex align-items-center bg-white border rounded px-2 py-1" style={{ maxWidth: '300px', width: '100%' }}>
          <input
            type="text"
            placeholder="Search..."
            className="form-control border-0 shadow-none me-2"
             value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
          <FaSearch className="text-muted" />
          </button>
        </form>

        {/* Navigation */}
        <ul className="nav align-items-center gap-3 mb-0">
          <li className="nav-item">
            <Link to="/" className="nav-link text-dark fw-medium">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link text-dark fw-medium">About</Link>
          </li>

          {currentUser ? (
            <li className="nav-item">
              <Link to="/profile">
                <img
                  src={currentUser.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                  alt="profile"
                  className="rounded-circle"
                  style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                />
              </Link>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/sign-in" className="nav-link text-dark fw-medium">Sign In</Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
