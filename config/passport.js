import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

/**
 * Configure Google OAuth Strategy
 * Serializes and deserializes user for session management
 */
export const configureGoogleOAuth = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
              firstName: profile.name.givenName || '',
              lastName: profile.name.familyName || '',
              email: profile.emails[0].value,
              role: 'customer',
              googleId: profile.id
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  /**
   * Serialize user to session
   */
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  /**
   * Deserialize user from session
   */
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default passport;
