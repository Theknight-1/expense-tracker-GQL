import { users } from "../../Data/data.js";
import User from "../../models/user.model.js";

import bcrypt from "bcryptjs";

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;

        if (!username || !name || !password || !gender) {
          throw new Error({ status: 404, message: "All fields are required" });
        }

        const existingUser = await User.findOne(username);

        if (existingUser) {
          throw new Error(
            "User already exits with this Username, try other username or login"
          );
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          userName: username,
          name: name,
          passowrd: hashedPassword,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
          gender: gender,
        });

        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (err) {
        console.log("Error in createUser : ", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;

        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });

        if (!user) {
          throw new Error(
            "User does not exit. Please signup or change your credentials."
          );
        }
        await context.login(user);
      } catch (err) {
        console.log("Error in Login : ", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },
    logout: async (_, _, context) => {
      try {
        await context.logout;
        req.session.destroy((err) => {
          if (err) {
            throw err;
          }
        });
        res.clearCookie("connected.sid");
        return { message: "Looged out successfully" };
      } catch (err) {
        console.log("Error in Logout : ", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },
  },
  Query: {
    authUser: async (_, _, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.log("Error in authUser", err);
        throw new Error(err.message || "Internal server error");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.log("Error in findUserbyID", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
  //TODO => Add user/transaction relation
};

export default userResolver;
