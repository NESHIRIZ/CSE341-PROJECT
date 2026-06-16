import mongoose from 'mongoose';

const dealershipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Dealership name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[\d\-\+\(\)\s]+$/, 'Please provide a valid phone number'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
  },
  { timestamps: true }
);

const Dealership = mongoose.model('Dealership', dealershipSchema);

export default Dealership;
