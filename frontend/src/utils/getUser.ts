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
  const token = localStorage.getItem("token") || null;
  if (!token) return null;

  return JSON.parse(token);
};
