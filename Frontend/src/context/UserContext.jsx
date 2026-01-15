import React, { createContext, useState } from "react";

export const UserDataContext = createContext(null);
const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    email: "",
    fullname: {
      firstName: "",
      lastName: "",
    },
  });
  const values = {
    user,
    setUser,
  };
  return (
    <UserDataContext.Provider value={values}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
