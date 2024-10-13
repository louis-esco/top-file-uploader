const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../prisma/queries");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = db.findUserByUsername(username);

      // User doesn't exist
      if (!user) {
        return done(null, false, { msg: "Incorrect username" });
      }

      //Check if passwords match
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { msg: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = db.findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
