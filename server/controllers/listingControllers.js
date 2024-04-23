const Listing = require('../models/listing.model');
const Agent = require('../models/agents');
const Owner = require('../models/owners');

const createListing = async (req, res) => {
    try {
        // Extract formData including accountBalance from the request body
        const { accountBalance, role, ...listingData } = req.body;
        
        // Create the listing
        const listing = await Listing.create(listingData);
        
       if(role === 'Agent'){
         // Update the agent's account balance
         const agent = await Agent.findById(listing.userRef);
         if (!agent) {
           return res.status(404).json({ error: 'Agent not found' });
         }
         // Add the accountBalance to the agent's current balance
         agent.accountBalance += 100;
         await agent.save();
       }else if(role === 'Owner'){
           // Update the agent's account balance
         const owner = await Owner.findById(listing.userRef);
         if (!owner) {
           return res.status(404).json({ error: 'Owner not found' });
         }
         // Add the accountBalance to the agent's current balance
         owner.accountBalance += 0;
         await owner.save();
       }
      
        return res.status(201).json(listing);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//delete your listing function
const deleteListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found!'})
    }

    if (req.user.id !== listing.userRef) {
      return es.status(404).json({ error: 'You can only delete your own listings!'})
    }
  
    try {
      await Listing.findByIdAndDelete(req.params.id);
      res.status(200).json('Listing has been deleted!');

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//update your lisitng function
const updateListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({ error: 'Listing not found!'})
  }

  if (req.user.id !== listing.userRef) {
    return es.status(404).json({ error: 'You can only update your own listings!'})
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);

  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
  }
}

const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found!'})
    }
    res.status(200).json(listing);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getListings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if(offer === undefined || offer === 'false'){
      offer = {$in: [false, true] }
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';
    
    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i'},
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order})
      .limit(limit)
      .skip(startIndex)
   
    res.status(200).json(listings);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
    createListing,
    deleteListing,
    updateListing,
    getListing,
    getListings,
};