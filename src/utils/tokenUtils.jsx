export const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const setToken = (token) => {

    localStorage.setItem("token", token);
  
   // sessionStorage.setItem("token", token);
  
};

export const clearToken = () => {
  localStorage.removeItem("token");
  //sessionStorage.removeItem("token");
};
