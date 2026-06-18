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
    const { firstName, lastName, email: rawEmail, password, role } = req.body;
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = '[REDACTED]';
    console.log('[REGISTER] Incoming request body (redacted):', safeBody);

    const emailBefore = rawEmail;
    const normalizedEmail = rawEmail ? String(rawEmail).trim().toLowerCase() : '';
    console.log('[REGISTER] Email before normalization:', emailBefore);
    console.log('[REGISTER] Email after normalization:', normalizedEmail);

    // Strong password checks (also enforced in validation middleware)
    const pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!pwPattern.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
      });
    }

    // Prevent open admin registration unless explicitly allowed
    let assignedRole = 'buyer';
    if (role && ['buyer', 'seller', 'admin'].includes(role)) {
      if (role === 'admin' && process.env.ALLOW_ADMIN_REG !== 'true') {
        console.log('[REGISTER] Admin role registration attempted but blocked');
        assignedRole = 'buyer';
      } else {
        assignedRole = role;
      }
    }

    // Ensure we check using normalized email
    const existingUser = await User.findOne({ email: normalizedEmail });
    console.log('[REGISTER] Email lookup result:', existingUser ? 'User found' : 'No user found');

    if (existingUser) {
      console.log(`[REGISTER] Duplicate email detected: ${normalizedEmail}`);
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const user = new User({
      firstName,
      lastName,
      email: normalizedEmail,
      password,
      role: assignedRole,
    });

    await user.save();
    console.log(`[REGISTER] New user created successfully - ID: ${user._id}, Email: ${user.email}`);

    const token = signToken(user);
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ success: true, message: 'User registered successfully', token, data: userResponse });
  } catch (error) {
    console.error('[REGISTER] Error:', error);
    // In development, return detailed error
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ success: false, message: error.message, error: error });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email: rawEmail, password } = req.body;
    const normalizedEmail = rawEmail ? String(rawEmail).trim().toLowerCase() : '';
    console.log('[LOGIN] Incoming login email (raw):', rawEmail);
    console.log('[LOGIN] Using normalized email for lookup:', normalizedEmail);
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

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

export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
