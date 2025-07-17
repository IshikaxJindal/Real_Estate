//client/src/pages/UpdateListing.jsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
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

useEffect(() => {
  const fetchListing = async () => {
    const listingId = params.listingId;
    const res = await fetch(`/api/listing/get/${listingId}`);
    const data = await res.json();
    if (data.success === false) {
      console.log(data.message);
      return;
    }

    const normalizedImageUrls = Array.isArray(data.imageUrls)
      ? data.imageUrls.map((img) => (typeof img === 'string' ? img : img.url || ''))
      : [];

    setFormData({
      ...data,
      imageUrls: normalizedImageUrls.filter(Boolean), // remove empty strings
    });
  };

  fetchListing();
}, []);



 const handleImageSubmit = async () => {
  if (files.length === 0) return;
  if (files.length + formData.imageUrls.length > 6) {
    return setImageUploadError('You can only upload 6 images per listing');
  }

  setUploading(true);
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const uploads = Array.from(files).map(async (file) => {
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only jpg, jpeg, png, webp allowed.');
    }
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'prime_estate');
    const res = await fetch('https://api.cloudinary.com/v1_1/dtgao6prg/image/upload', {
      method: 'POST',
      body: data,
    });
    const result = await res.json();
    console.log("Cloudinary response:", result); 
    return result.secure_url;

  });

  try {
    const urls = await Promise.all(uploads);
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ...urls], // ✅ Append objects, not strings
    }));
    setImageUploadError(false);
  } catch (err) {
    setImageUploadError(err.message);
  } finally {
    setUploading(false);
  }
};

    const handleRemoveImage = (index) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        imageUrls: prevFormData.imageUrls.filter((_, i) => i !== index),
      }));
    };


  const handleChange = (e) => {
    if (['sale', 'rent'].includes(e.target.id)) {
      setFormData({ ...formData, type: e.target.id });
    } else if (['parking', 'furnished', 'offer', 'lift'].includes(e.target.id)) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    } else if ([
      'text', 'textarea', 'number'
    ].includes(e.target.type)) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');

      setLoading(true);
      // 👇 Clean imageUrls just before sending
      const cleanedFormData = {
        ...formData,
        imageUrls: Array.isArray(formData.imageUrls)
          ? formData.imageUrls.filter(url => typeof url === 'string')
          : [],
        userRef: currentUser._id,
      };

      console.log("Submitting cleanedFormData:", cleanedFormData);

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedFormData),
      });

      const data = await res.json();
      setLoading(false);
      if (!data.success) return setError(data.message);
      window.alert('Listing updated successfully!');
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <main className="container py-4">
      <h1 className="text-center mb-4 fw-bold display-6">Update a Listing</h1>
      <form onSubmit={handleSubmit} className="row g-4">
        <div className="col-md-6">
          <input type="text" className="form-control" id="name" placeholder="Name" maxLength="62" minLength="10" required onChange={handleChange} value={formData.name} />
          <textarea className="form-control mt-3" id="description" placeholder="Description" required onChange={handleChange} value={formData.description} />
          <input type="text" className="form-control mt-3" id="address" placeholder="Address" required onChange={handleChange} value={formData.address} />

          {[['sale', 'Sell'], ['rent', 'Rent'], ['parking', 'Parking'], ['furnished', 'Furnished'], ['offer', 'Offer'], ['lift', 'Lift']].map(([id, label]) => (
            <div className="form-check mt-2" key={id}>
              <input className="form-check-input" type="checkbox" id={id} checked={formData[id]} onChange={handleChange} />
              <label className="form-check-label" htmlFor={id}>{label}</label>
            </div>
          ))}

          <div className="row mt-3">
            <div className="col">
              <label htmlFor="bedrooms" className="form-label">Beds</label>
              <input type="number" id="bedrooms" min="1" max="10" required className="form-control" onChange={handleChange} value={formData.bedrooms} />
            </div>
            <div className="col">
              <label htmlFor="bathrooms" className="form-label">Baths</label>
              <input type="number" id="bathrooms" min="1" max="10" required className="form-control" onChange={handleChange} value={formData.bathrooms} />
            </div>
            <div className="col">
              <label htmlFor="regularPrice" className="form-label">Regular price (₹/month)</label>
              <input type="number" id="regularPrice" min="50" max="10000000" required className="form-control" onChange={handleChange} value={formData.regularPrice} />
            </div>
            {formData.offer && (
              <div className="col">
                <label htmlFor="discountPrice" className="form-label">Discounted price (₹/month)</label>
                <input type="number" id="discountPrice" min="0" max="10000000" required className="form-control" onChange={handleChange} value={formData.discountPrice} />
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Images (first one will be the cover - max 6):</label>
          <div className="d-flex gap-3">
            <input className="form-control" type="file" id="images" accept="image/jpeg,image/png,image/webp,image/jpg" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
            <button type="button" className="btn btn-outline-success" onClick={handleImageSubmit} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {imageUploadError && <p className="text-danger small mt-1">{imageUploadError}</p>}

         {formData.imageUrls.length > 0 && (
  <div className="row row-cols-2 g-2 mt-2">
        {formData.imageUrls.map((img, index) => {
          const url = typeof img === 'string' ? img : img.url;
          return (
            <div className="col d-flex align-items-center gap-2 border p-2" key={`image-${index}`}>
              <img
                src={url}
                alt={`listing-${index}`}
                className="rounded"
                style={{ height: '64px', width: '64px', objectFit: 'cover' }}
              />
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleRemoveImage(index)}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    )}

    <button disabled={loading || uploading} className="btn btn-primary mt-3 w-100">
      {loading ? 'Updating...' : 'Update listing'}
    </button>
    {error && <p className="text-danger small mt-2">{error}</p>}

        </div>
      </form>
    </main>
  );
}
