import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Vehicle year is required'],
      min: [1900, 'Year must be at least 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    mileage: {
      type: Number,
      required: [true, 'Mileage is required'],
      min: [0, 'Mileage must be a positive number'],
    },
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealership',
      required: [true, 'Dealer ID is required'],
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
