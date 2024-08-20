import passport from "passport";
import bcrypt from "bcryptjs";

import User from "../models/user.model";

import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport = async () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      console.log(error, { message: "Error in deserializing the USER" });
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne(username);
        if (!user) {
          throw new Error("Invalid username or Password");
        }
        const validPassword = await bcrypt.compare(password, user.passowrd);
        if (!user) {
          throw new Error("Invalid Password");
        }
        return done(null, user);
      } catch (error) {
        return done(err);
      }
    })
  );
};
