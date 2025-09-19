export const getUserFromLocalstorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

export const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token") || null;
};
