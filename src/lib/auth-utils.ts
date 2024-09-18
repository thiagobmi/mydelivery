
export const checkUserLoggedIn = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not logged in");
  }
  return true;
};
