import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
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
    </div>
  );
}
