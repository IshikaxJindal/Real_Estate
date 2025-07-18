import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Hero section */}
      <div className="container py-5">
        <div className="row justify-content-center text-center">
          <div className="col-lg-10">
            <h1 className="display-5 fw-bold text-secondary">
              Find your next <span className="text-muted">perfect</span><br />place with ease
            </h1>
            <p className="text-muted small mt-3">
              Sahand Estate is the best place to find your next perfect place to live.
              <br />We have a wide range of properties for you to choose from.
            </p>
            <Link
              to="/search"
              className="btn btn-link text-decoration-none text-primary fw-semibold"
            >
              Let's get started...
            </Link>
          </div>
        </div>
      </div>

      {/* Swiper Slider */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                  height: '500px',
                }}
              />
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listing Sections */}
      <div className="container my-5">
        {offerListings && offerListings.length > 0 && (
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 text-secondary fw-bold">Recent offers</h2>
              <Link to="/search?offer=true" className="text-primary small text-decoration-none">
                Show more offers
              </Link>
            </div>
            <div className="row g-3">
              {offerListings.map((listing) => (
                <div className="col-md-6 col-lg-4 col-xl-3" key={listing._id}>
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 text-secondary fw-bold">Recent places for rent</h2>
              <Link to="/search?type=rent" className="text-primary small text-decoration-none">
                Show more places for rent
              </Link>
            </div>
            <div className="row g-3">
              {rentListings.map((listing) => (
                <div className="col-md-6 col-lg-4 col-xl-3" key={listing._id}>
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 text-secondary fw-bold">Recent places for sale</h2>
              <Link to="/search?type=sale" className="text-primary small text-decoration-none">
                Show more places for sale
              </Link>
            </div>
            <div className="row g-3">
              {saleListings.map((listing) => (
                <div className="col-md-6 col-lg-4 col-xl-3" key={listing._id}>
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
