import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className="card shadow-sm mb-3" style={{ width: '100%', maxWidth: '330px' }}>
      <Link to={`/listing/${listing._id}`} className="text-decoration-none text-dark">
        <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt="listing cover"
          className="card-img-top"
          style={{ height: '220px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column gap-2">
          <h5 className="card-title text-truncate">{listing.name}</h5>
          
          <div className="d-flex align-items-center gap-1">
            <MdLocationOn className="text-success" />
            <p className="card-subtitle mb-1 text-muted text-truncate w-100">
              {listing.address}
            </p>
          </div>

          <p className="card-text text-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {listing.description}
          </p>

          <p className="fw-semibold text-primary mt-2">
            ${listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>

          <div className="d-flex justify-content-start text-muted fw-bold gap-3 small">
            <span>{listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}</span>
            <span>{listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
