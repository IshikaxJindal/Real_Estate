import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [localPreviews, setLocalPreviews] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: '',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    lift: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const formDataImage = new FormData();
          formDataImage.append('image', file);

          const res = await fetch('/api/upload/image', {
            method: 'POST',
            body: formDataImage,
          });

          const data = await res.json();
          return data;
        });

        const uploadedImages = await Promise.all(uploadPromises);

        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...uploadedImages],
        }));
        setFiles([]);
        setLocalPreviews([]);
      } catch (err) {
        console.error('Upload error', err);
        setImageUploadError('Image upload failed');
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError('Max 6 images allowed');
    }
  };

  const handleRemoveImage = async (public_id) => {
    try {
      await fetch('/api/cloudinary/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id }),
      });

      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.filter((img) => img.public_id !== public_id),
      }));
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    } else if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer' ||
      e.target.id === 'lift'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    } else if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        setError('You must upload at least one image');
        return;
      }
      if (+formData.regularPrice < +formData.discountPrice) {
        setError('Discount price must be lower than regular price');
        return;
      }
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="container py-4">
      <h1 className="text-center mb-4 fw-semibold fs-3">Create a Listing</h1>
      <form className="row g-4" onSubmit={handleSubmit}>
        <div className="col-md-6 d-flex flex-column gap-3">
          <input
            type="text"
            placeholder="Name"
            className="form-control"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="form-control"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="form-control"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="d-flex flex-wrap gap-3">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="type" id="sale" checked={formData.type === 'sale'} onChange={handleChange} />
              <label className="form-check-label" htmlFor="sale">Sell</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="type" id="rent" checked={formData.type === 'rent'} onChange={handleChange} />
              <label className="form-check-label" htmlFor="rent">Rent</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="parking" onChange={handleChange} checked={formData.parking} />
              <label className="form-check-label" htmlFor="parking">Parking Spot</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="furnished" onChange={handleChange} checked={formData.furnished} />
              <label className="form-check-label" htmlFor="furnished">Furnished</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="lift" onChange={handleChange} checked={formData.lift} />
              <label className="form-check-label" htmlFor="lift">Lift</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="offer" onChange={handleChange} checked={formData.offer} />
              <label className="form-check-label" htmlFor="offer">Offer</label>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-6">
              <label htmlFor="bedrooms" className="form-label">Beds</label>
              <input type="number" id="bedrooms" min="1" max="10" required className="form-control" onChange={handleChange} value={formData.bedrooms} />
            </div>
            <div className="col-6">
              <label htmlFor="bathrooms" className="form-label">Baths</label>
              <input type="number" id="bathrooms" min="1" max="10" required className="form-control" onChange={handleChange} value={formData.bathrooms} />
            </div>
            <div className="col-6">
              <label className="form-label">Regular price (₹)</label>
              <input type="number" id="regularPrice" min="1" max="10000000" required className="form-control" onChange={handleChange} value={formData.regularPrice} />
              {formData.type === 'rent' && <div className="form-text">₹ / month</div>}
            </div>
            <div className="col-6">
              <label className="form-label">Discounted price (₹)</label>
              <input type="number" id="discountPrice" min="1" max="10000000" className="form-control" onChange={handleChange} value={formData.discountPrice} />
              {formData.type === 'rent' && <div className="form-text">₹ / month</div>}
            </div>
          </div>
        </div>

        <div className="col-md-6 d-flex flex-column gap-3">
          <label className="form-label fw-semibold">
            Images: <span className="text-muted">The first image will be the cover (max 6)</span>
          </label>
          <div className="input-group">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              multiple
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files);
                const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                const filteredFiles = selectedFiles.filter(file => validTypes.includes(file.type));

                if (filteredFiles.length !== selectedFiles.length) {
                  alert('Only JPG, JPEG, PNG, and WEBP files are allowed.');
                }

                if (filteredFiles.length + files.length + formData.imageUrls.length > 6) {
                  setImageUploadError('Max 6 images allowed');
                  return;
                }

                setFiles((prev) => [...prev, ...filteredFiles]);
                setLocalPreviews((prev) => [...prev, ...filteredFiles.map(file => URL.createObjectURL(file))]);
              }}
              disabled={formData.imageUrls.length >= 6}
            />
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={handleImageSubmit}
              disabled={uploading || formData.imageUrls.length >= 6}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {imageUploadError && <p className="text-danger mt-1">{imageUploadError}</p>}
          {error && <p className="text-danger mt-1">{error}</p>}

          <div className="d-flex flex-wrap gap-3">
            {localPreviews.map((previewUrl, index) => (
              <div key={`local-${index}`} className="d-flex flex-column align-items-center border p-2 rounded">
                <img
                  src={previewUrl}
                  alt={`preview-${index}`}
                  className="rounded"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm mt-1"
                  onClick={() => {
                    const newFiles = [...files];
                    newFiles.splice(index, 1);
                    const newPreviews = [...localPreviews];
                    newPreviews.splice(index, 1);
                    setFiles(newFiles);
                    setLocalPreviews(newPreviews);
                  }}
                >
                  Delete
                </button>
              </div>
            ))}

            {formData.imageUrls.map((img, index) => (
              <div key={index} className="d-flex flex-column align-items-center border p-2 rounded">
                <img
                  src={img.url}
                  alt={`uploaded-${index}`}
                  className="rounded"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm mt-1"
                  onClick={() => handleRemoveImage(img.public_id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-dark text-uppercase mt-3" disabled={loading || uploading}>
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </main>
  );
}
