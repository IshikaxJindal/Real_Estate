import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        console.log("OAuth backend error:", data.message);
        return;
      }

      dispatch(signInSuccess(data.user));
      navigate('/');
    } catch (error) {
      console.log('Could not sign in with Google', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="btn btn-danger w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
    >
      <i className="bi bi-google"></i> Continue with Google
    </button>
  );
}
