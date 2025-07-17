import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
          const { imageUrls } = req.body;

  if (imageUrls !== undefined) {
    if (!Array.isArray(imageUrls) || !imageUrls.every(url => typeof url === 'string')) {
      return next(errorHandler(400, 'imageUrls must be an array of strings'));
    }
}
    console.log("Updating listing with:", req.body);

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
  success: true,
  ...updatedListing._doc,
});

  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
 try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
}
}
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    // Normalize all filter fields
    const normalizeBooleanFilter = (value) => {
      if (value === undefined || value === 'false') return { $in: [false, true] };
      if (value === 'true') return true;
      return { $in: [false, true] }; // fallback
    };

    const offer = normalizeBooleanFilter(req.query.offer);
    const furnished = normalizeBooleanFilter(req.query.furnished);
    const parking = normalizeBooleanFilter(req.query.parking);
    const lift = normalizeBooleanFilter(req.query.lift);

    // Handle type filter
    let type = req.query.type;
    if (!type || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      lift,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
