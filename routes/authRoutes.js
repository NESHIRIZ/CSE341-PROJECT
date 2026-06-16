import express from 'express';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to dashboard on successful login
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/failed' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', (req, res) => {
  req.logOut((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Not authenticated
 */
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

/**
 * @swagger
 * /api/auth/failed:
 *   get:
 *     summary: Authentication failed endpoint
 *     tags: [Authentication]
 *     responses:
 *       401:
 *         description: Authentication failed
 */
router.get('/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Authentication failed. Please try again.'
  });
});

export default router;
