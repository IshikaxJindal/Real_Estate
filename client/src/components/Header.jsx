import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link  } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-light shadow-sm py-3 border-bottom">
      <div className="container-fluid px-4">
        <div className="row align-items-center">
          {/* Brand */}
          <div className="col-4">
  <Link to='/' className="text-decoration-none">
    <h1 className="fw-bold fs-5 mb-0">
      <span className="text-secondary">Sahand</span>
      <span className="text-dark">Estate</span>
    </h1>
  </Link>
</div>


          {/* Search Bar */}
          <div className="col-4 d-flex justify-content-center">
            <form className="d-flex bg-white border rounded px-2 py-1 w-100" style={{ maxWidth: "400px" }}>
              <input
                type="text"
                placeholder="Search..."
                className="form-control border-0 me-2 shadow-none"
              />
              <button type="submit" className="btn btn-link p-0 text-dark">
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Nav Links with Hover Effect */}
          <div className="col-4 d-flex justify-content-end">
           <ul className="nav">
  <li className="nav-item d-none d-sm-block">
    <Link to='/' className="nav-link text-dark fw-semibold hover-effect text-decoration-none">Home</Link>
  </li>
  <li className="nav-item">
    <Link to='/about' className="nav-link text-dark fw-semibold hover-effect text-decoration-none">About</Link>
  </li>
  <li className="nav-item">
    <Link to='/signin' className="nav-link text-dark fw-semibold hover-effect text-decoration-none">Sign In</Link>
  </li>
</ul>

          </div>
        </div>
      </div>

      {/* Custom hover style */}
      <style>
        {`
          .hover-effect:hover {
            color: #0d6efd !important;  /* Bootstrap primary color */
            font-weight: bold;
          }
        `}
      </style>
    </header>
  );
}
