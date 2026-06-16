import Vehicle from '../models/Vehicle.js';
import Dealership from '../models/Dealership.js';

// Get all vehicles
export const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().populate('dealerId', 'name location email phone');
    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// Get vehicle by ID
export const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('dealerId', 'name location email phone');
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }
    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// Create new vehicle
export const createVehicle = async (req, res, next) => {
  try {
    const { make, model, year, price, mileage, dealerId } = req.body;

    // Verify dealership exists
    const dealership = await Dealership.findById(dealerId);
    if (!dealership) {
      return res.status(404).json({
        success: false,
        message: 'Dealership not found',
      });
    }

    const vehicle = new Vehicle({
      make,
      model,
      year,
      price,
      mileage,
      dealerId,
    });

    await vehicle.save();
    await vehicle.populate('dealerId', 'name location email phone');

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// Update vehicle
export const updateVehicle = async (req, res, next) => {
  try {
    const { make, model, year, price, mileage, dealerId } = req.body;
    const updateData = {};

    if (make) updateData.make = make;
    if (model) updateData.model = model;
    if (year) updateData.year = year;
    if (price !== undefined) updateData.price = price;
    if (mileage !== undefined) updateData.mileage = mileage;
    if (dealerId) {
      const dealership = await Dealership.findById(dealerId);
      if (!dealership) {
        return res.status(404).json({
          success: false,
          message: 'Dealership not found',
        });
      }
      updateData.dealerId = dealerId;
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('dealerId', 'name location email phone');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// Delete vehicle
export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};
