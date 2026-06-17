import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
};

const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: jwtExpiresIn,
    }
  );
};

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use',
      });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: role || 'buyer',
    });

    await user.save();

    const token = signToken(user);
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = signToken(user);
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};
