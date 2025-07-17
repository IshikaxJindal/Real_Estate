import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
    signOutUserStart,
     signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
   const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        password: '',
        avatar: currentUser.avatar || '',
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(deleteUserSuccess(data));
    setDeleteMessage(data.message);

    // Delay and redirect
    setTimeout(() => {
      navigate('/sign-in');
    }, 2000); // 2-second delay
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
  }
};


const handleSignOut = async () => {
  try {
    dispatch(signOutUserStart());
    const res = await fetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(signOutUserFailure(data.message));
      return;
    }
    dispatch(signOutUserSuccess());
    navigate('/sign-in');
  } catch (error) {
    dispatch(signOutUserFailure(error.message));
  }
};

 const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container py-5 d-flex flex-column align-items-center" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Profile</h2>

      <img
        src={formData.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
        alt="profile"
        className="rounded-circle mb-3"
        style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
      />

      <form onSubmit={handleSubmit} className="w-100">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            id="username"
            className="form-control"
            value={formData.username || ''}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            placeholder="Enter email"
            id="email"
            className="form-control"
            value={formData.email || ''}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            id="password"
            className="form-control"
            value={formData.password || ''}
            onChange={handleChange}
          />
        </div>

                <div className="d-grid gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Update'}
          </button>

       <Link
        to="/create-listing"
        className="btn btn-success text-uppercase text-center px-4 py-2"
      >
        Create Listing
      </Link>
        </div>
        
      </form>

      <div className="d-flex justify-content-between w-100 mt-4 px-1">
        <span
          onClick={handleDeleteUser}
          className="text-danger"
          role="button"
          style={{ cursor: 'pointer' }}
        >
          Delete account
        </span>

        <span onClick={handleSignOut} className="text-danger"
          role="button"
          style={{ cursor: 'pointer' }}>Sign out</span>
      </div>

      {error && <div className="alert alert-danger w-100 mt-3">{error}</div>}
      {updateSuccess && (
        <div className="alert alert-success w-100 mt-3">
          User updated successfully!
        </div>
      )}
      {deleteMessage && (
        <div className="alert alert-success w-100 mt-3">
          {deleteMessage}
        </div>
      )}

      <button onClick={handleShowListings} className="btn btn-outline-success w-100 mb-3">
  Show Listings
</button>

{showListingsError && (
  <p className="text-danger mt-3">Error showing listings</p>
)}

{userListings && userListings.length > 0 && (
  <div className="d-flex flex-column gap-3 mt-4">
    <h1 className="text-center mt-4 fs-4 fw-semibold">Your Listings</h1>

    {userListings.map((listing) => (
  <div
    key={listing._id}
    className="border rounded p-3 d-flex justify-content-between align-items-center gap-3"
  >
    <Link to={`/listing/${listing._id}`}>
      <img
        src={listing.imageUrls[0]?.url || listing.imageUrls[0]} // supports both object and string formats
        alt="listing cover"
        className="rounded"
        style={{ height: '64px', width: '64px', objectFit: 'contain' }}
      />
    </Link>

    <Link
      to={`/listing/${listing._id}`}
      className="text-decoration-none text-dark flex-grow-1 fw-semibold text-truncate mx-2"
    >
      {listing.name}
    </Link>

    <div className="d-flex flex-column align-items-end gap-1">
       <button
      onClick={() => handleListingDelete(listing._id)}
      className="btn btn-sm btn-outline-danger text-uppercase"
    >
      Delete
    </button>
      <Link to={`/update-listing/${listing._id}`}>
      <button className="btn btn-sm btn-outline-success text-uppercase">
        Edit
      </button>
      </Link>
    </div>
  </div>
    ))}
  
  </div>
)}

    </div>
  );
}
