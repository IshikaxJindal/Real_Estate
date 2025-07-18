import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';
import 'swiper/css/bundle';
     import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
  FaSortAmountUpAlt,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false); 
  const params = useParams();
  const {currentUser} = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="container py-4">
      {loading && <p className="text-center my-4 fs-4">Loading...</p>}
      {error && <p className="text-center my-4 fs-4 text-danger">Something went wrong!</p>}

      {listing && !loading && !error && (
        <div className="row">
          <div className="col-12">
            <Swiper navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
   <img
  src={url.replace('/upload/', '/upload/q_auto,f_auto/')}
  className="img-fluid d-block w-100"
  style={{
    height: '550px',
    objectFit: 'cover',
    objectPosition: 'center',
  }}
  alt="listing"
/>


                </SwiperSlide>
              ))}
            </Swiper>
       

{/* Share Button */}
<div
  className="position-fixed top-0 end-0 mt-5 me-3 z-3 bg-light border rounded-circle d-flex justify-content-center align-items-center"
  style={{ width: '48px', height: '48px', cursor: 'pointer' }}
>
  <FaShare
    className="text-secondary"
    onClick={() => {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }}
  />
</div>

{/* Copied Text */}
{copied && (
  <p className="position-fixed top-0 end-0 mt-5 me-5 z-3 bg-light rounded p-2">
    Link copied!
  </p>
)}

{/* Main Listing Info */}
<div className="container my-5">
  <div className="mx-auto" style={{ maxWidth: '900px' }}>
    <h2 className="fw-bold">
      {listing.name} – ₹{' '}
      {listing.offer
        ? listing.discountPrice.toLocaleString('en-IN')
        : listing.regularPrice.toLocaleString('en-IN')}
      {listing.type === 'rent' && ' / month'}
    </h2>

    <p className="d-flex align-items-center gap-2 text-muted mt-3">
      <FaMapMarkerAlt className="text-success" />
      {listing.address}
    </p>

    <div className="d-flex flex-wrap gap-3 mt-2">
      <p className="bg-danger text-white text-center p-2 rounded" style={{ minWidth: '150px' }}>
        {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
      </p>
      {listing.offer && (
        <p className="bg-success text-white text-center p-2 rounded" style={{ minWidth: '150px' }}>
          ₹{+listing.regularPrice - +listing.discountPrice} OFF
        </p>
      )}
    </div>

    <p className="mt-4 text-secondary">
      <strong className="text-dark">Description - </strong>
      {listing.description}
    </p>

    <ul className="list-unstyled d-flex flex-wrap gap-4 text-success fw-semibold mt-3">
      <li className="d-flex align-items-center gap-2">
        <FaBed className="fs-5" />
        {listing.bedrooms > 1
          ? `${listing.bedrooms} beds `
          : `${listing.bedrooms} bed `}
      </li>
      <li className="d-flex align-items-center gap-2">
        <FaBath className="fs-5" />
        {listing.bathrooms > 1
          ? `${listing.bathrooms} baths `
          : `${listing.bathrooms} bath `}
      </li>
      <li className="d-flex align-items-center gap-2">
        <FaParking className="fs-5" />
        {listing.parking ? 'Parking spot' : 'No Parking'}
      </li>
      <li className="d-flex align-items-center gap-2">
        <FaChair className="fs-5" />
        {listing.furnished ? 'Furnished' : 'Unfurnished'}
      </li>
      <li className="d-flex align-items-center gap-2">
        <FaSortAmountUpAlt className="fs-5" />
        {listing.lift ? 'Lift available' : 'No lift'}
      </li>
    </ul>
    {console.log('CurrentUser:', currentUser)}
{console.log('Listing userRef:', listing.userRef)}
{console.log('Contact state:', contact)}
         {currentUser && listing.userRef !== currentUser._id && !contact && (
        <button
            onClick={() => setContact(true)}
            className="btn btn-dark text-uppercase mt-3"
        >
            Contact Landlord
        </button>
        )}

{contact && <Contact listing={listing} />}

  </div>
</div>

          </div>
        </div>
      )}
    </main>
  );
}
