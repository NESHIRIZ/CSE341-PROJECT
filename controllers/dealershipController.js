import Dealership from '../models/Dealership.js';

// Get all dealerships
export const getAllDealerships = async (req, res, next) => {
  try {
    const dealerships = await Dealership.find();
    res.status(200).json({
      success: true,
      count: dealerships.length,
      data: dealerships,
    });
  } catch (error) {
    next(error);
  }
};

// Get dealership by ID
export const getDealershipById = async (req, res, next) => {
  try {
    const dealership = await Dealership.findById(req.params.id);
    if (!dealership) {
      return res.status(404).json({
        success: false,
        message: 'Dealership not found',
      });
    }
    res.status(200).json({
      success: true,
      data: dealership,
    });
  } catch (error) {
    next(error);
  }
};

// Create new dealership
export const createDealership = async (req, res, next) => {
  try {
    const { name, location, phone, email } = req.body;

    const dealership = new Dealership({
      name,
      location,
      phone,
      email,
    });

    await dealership.save();

    res.status(201).json({
      success: true,
      message: 'Dealership created successfully',
      data: dealership,
    });
  } catch (error) {
    next(error);
  }
};

// Update dealership
export const updateDealership = async (req, res, next) => {
  try {
    const { name, location, phone, email } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (location) updateData.location = location;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;

    const dealership = await Dealership.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!dealership) {
      return res.status(404).json({
        success: false,
        message: 'Dealership not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Dealership updated successfully',
      data: dealership,
    });
  } catch (error) {
    next(error);
  }
};

// Delete dealership
export const deleteDealership = async (req, res, next) => {
  try {
    const dealership = await Dealership.findByIdAndDelete(req.params.id);

    if (!dealership) {
      return res.status(404).json({
        success: false,
        message: 'Dealership not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Dealership deleted successfully',
      data: dealership,
    });
  } catch (error) {
    next(error);
  }
};
