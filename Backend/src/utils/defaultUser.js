import { User } from "../models/user.model.js";

const createDefaultUser = async () => {
  const defaultUser = [
    {
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "admin@123",
      role: "admin",
    },

    {
      username: process.env.OPERATOR_USERNAME || "operator",
      password: process.env.OPERATOR_PASSWORD || "operator@123",
      role: "operator",
    },
  ];

  for (let user of defaultUser){
    const exist = await User.findOne({username:user.username})

    if(!exist) {
        await User.create({
            username: user.username,
            password: user.password,
            role:user.role
        });

        console.log("Default User created");
        
    }
  }
};

export default createDefaultUser;
