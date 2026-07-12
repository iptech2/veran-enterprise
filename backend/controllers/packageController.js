const Package = require("../models/Package");

/* ===================================
   GET ACTIVE PACKAGES (USER)
=================================== */

exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      isActive: true,
    }).sort({ minAmount: 1 });

    res.json(packages);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ===================================
   GET ALL PACKAGES (ADMIN)
=================================== */

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().sort({
      createdAt: -1,
    });

    res.json(packages);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ===================================
   CREATE PACKAGE
=================================== */

exports.createPackage = async (req, res) => {
  try {
    const package = await Package.create(req.body);

    res.status(201).json({
      message: "Package created successfully",
      package,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ===================================
   UPDATE PACKAGE
=================================== */

exports.updatePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!package) {
      return res.status(404).json({
        message: "Package not found",
      });
    }

    res.json({
      message: "Package updated successfully",
      package,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ===================================
   DELETE PACKAGE
=================================== */

exports.deletePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndDelete(
      req.params.id
    );

    if (!package) {
      return res.status(404).json({
        message: "Package not found",
      });
    }

    res.json({
      message: "Package deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};