const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error("Error fetching listings:", err);
        req.flash("error", "Unable to fetch listings");
        res.redirect("/");
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id)
            .populate({
                path: "review",
                populate: { path: "author" }
            })
            .populate("owner");
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist");
            return res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        req.flash("error", "Unable to fetch listing");
        res.redirect("/listings");
    }
};

module.exports.createListing = async (req, res) => {
    try {
        const url = req.file.path;
        const filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();
        req.flash("success", "Listing created successfully!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error creating listing:", err);
        req.flash("error", "Unable to create listing");
        res.redirect("/listings/new");
    }
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist");
            return res.redirect("/listings");
        }

        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("upload", "/upload/w_250");
        res.render("listings/edit.ejs", { listing, originalImageUrl });
    } catch (err) {
        console.error("Error fetching listing for edit:", err);
        req.flash("error", "Unable to fetch listing for edit");
        res.redirect("/listings");
    }
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

        if (req.file) {
            const url = req.file.path;
            const filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }

        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Error updating listing:", err);
        req.flash("error", "Unable to update listing");
        res.redirect(`/listings/${id}/edit`);
    }
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        req.flash("success", "Listing deleted successfully!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error deleting listing:", err);
        req.flash("error", "Unable to delete listing");
        res.redirect("/listings");
    }
};
