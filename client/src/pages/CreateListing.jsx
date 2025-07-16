import { useState } from 'react';

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [localPreviews, setLocalPreviews] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState('');

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

  return (
    <main className="container py-4">
      <h1 className="text-center mb-4 fw-semibold fs-3">Create a Listing</h1>
      <form className="row g-4">
        <div className="col-md-6 d-flex flex-column gap-3">
          <input type="text" placeholder="Name" className="form-control" id="name" maxLength="62" minLength="10" required />
          <textarea placeholder="Description" className="form-control" id="description" required />
          <input type="text" placeholder="Address" className="form-control" id="address" required />

          <div className="d-flex flex-wrap gap-3">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="type" id="sale" checked={type === 'sale'} onChange={() => setType('sale')} />
              <label className="form-check-label" htmlFor="sale">Sell</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="type" id="rent" checked={type === 'rent'} onChange={() => setType('rent')} />
              <label className="form-check-label" htmlFor="rent">Rent</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="parking" />
              <label className="form-check-label" htmlFor="parking">Parking Spot</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="furnished" />
              <label className="form-check-label" htmlFor="furnished">Furnished</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="lift" />
              <label className="form-check-label" htmlFor="lift">Lift</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="offer" />
              <label className="form-check-label" htmlFor="offer">Offer</label>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-6">
              <label htmlFor="bedrooms" className="form-label">Beds</label>
              <input type="number" id="bedrooms" min="1" max="10" required className="form-control" />
            </div>
            <div className="col-6">
              <label htmlFor="bathrooms" className="form-label">Baths</label>
              <input type="number" id="bathrooms" min="1" max="10" required className="form-control" />
            </div>
            <div className="col-6">
              <label className="form-label">Regular price (₹)</label>
              <input type="number" id="regularPrice" min="1" max="10000000" required className="form-control" />
              {type === 'rent' && <div className="form-text">₹ / month</div>}
            </div>
            <div className="col-6">
              <label className="form-label">Discounted price (₹)</label>
              <input type="number" id="discountPrice" min="1" max="10000000" required className="form-control" />
              {type === 'rent' && <div className="form-text">₹ / month</div>}
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

                if (filteredFiles.length + formData.imageUrls.length > 6) {
                  setImageUploadError('Max 6 images allowed');
                  return;
                }

                    setFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
      setLocalPreviews((prevPreviews) => [
        ...prevPreviews,
        ...filteredFiles.map((file) => URL.createObjectURL(file)),
      ]);

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

          <div className="d-flex flex-wrap gap-3">
            {localPreviews.length > 0 && localPreviews.map((previewUrl, index) => (
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

            {formData.imageUrls.length > 0 && formData.imageUrls.map((img, index) => (
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

          <button type="submit" className="btn btn-dark text-uppercase mt-3">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
