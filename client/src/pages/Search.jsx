import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ added useLocation
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ added this line

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    lift: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const liftFromUrl = urlParams.get('lift');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      liftFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        lift: liftFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
       setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
       if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]); // ✅ location.search will now work

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (['parking', 'furnished', 'offer', 'lift'].includes(e.target.id)) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked === true,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    if (sidebardata.parking) urlParams.set('parking', 'true');
    if (sidebardata.furnished) urlParams.set('furnished', 'true');
    if (sidebardata.offer) urlParams.set('offer', 'true');
    if (sidebardata.lift) urlParams.set('lift', 'true');
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div className="p-4 border-bottom border-md-end min-vh-100">
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
          {/* Search Term */}
          <div className="d-flex flex-column flex-md-row align-items-center gap-2">
            <label className="fw-semibold">Search Term:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="form-control w-100"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type Filter */}
          <div className="d-flex flex-column gap-2">
            <label className="fw-semibold">Type:</label>
            <div className="d-flex flex-wrap gap-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="all"
                  onChange={handleChange}
                  checked={sidebardata.type === 'all'} />
                <label className="form-check-label" htmlFor="all">
                  Rent & Sale
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="rent"
                  onChange={handleChange}
                  checked={sidebardata.type === 'rent'} />
                <label className="form-check-label" htmlFor="rent">
                  Rent
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="sale"
                  onChange={handleChange}
                  checked={sidebardata.type === 'sale'} />
                <label className="form-check-label" htmlFor="sale">
                  Sale
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="offer"
                  onChange={handleChange}
                  checked={sidebardata.offer} />
                <label className="form-check-label" htmlFor="offer">
                  Offer
                </label>
              </div>
            </div>
          </div>

          {/* Amenities Filter */}
          <div className="d-flex flex-column gap-2">
            <label className="fw-semibold">Amenities:</label>
            <div className="d-flex flex-wrap gap-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="parking"
                  onChange={handleChange}
                  checked={sidebardata.parking} />
                <label className="form-check-label" htmlFor="parking">
                  Parking
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="furnished"
                  onChange={handleChange}
                  checked={sidebardata.furnished} />
                <label className="form-check-label" htmlFor="furnished">
                  Furnished
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="lift"
                  onChange={handleChange}
                  checked={sidebardata.lift} />
                <label className="form-check-label" htmlFor="lift">
                  Lift
                </label>
              </div>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="d-flex flex-column flex-md-row align-items-center gap-2">
            <label className="fw-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to hight</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>

          {/* Search Button */}
          <button type="submit" className="btn btn-dark text-uppercase">
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="flex-grow-1">
        <h1 className="fs-3 fw-semibold border-bottom p-3 text-secondary mt-4 mt-md-0">
          Listing results:
        </h1>
        <div className="p-4 d-flex flex-wrap gap-3">
          {!loading && listings.length === 0 && (
            <p className="fs-5 text-secondary">No listing found!</p>
          )}
          {loading && (
            <p className="fs-5 text-secondary text-center w-100">Loading...</p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
                {showMore && (
    <button
        onClick={onShowMoreClick}
        className="btn btn-outline-success w-100 mt-3"
    >
        Show more
    </button>
    )}

        </div>
      </div>
    </div>
  );
}
