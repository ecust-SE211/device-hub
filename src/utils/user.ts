interface User extends Record<string, string | undefined> {
  id?: string;
  userType?: UserType;
  name?: string;
  email?: string;
  tel?: string;
}

const user: User = {};
type UserType = "M" | "L" | undefined;
const clearUserInfo = () => {
  for (const key in user) {
    delete user[key];
  }
  localStorage.removeItem("token");
};
const getId = () => {
  if (user.id) return user.id;
  const id = localStorage.getItem("id");
  if (id) {
    user.id = id;
  }
  return id ?? undefined;
};
const getUserType = (): UserType => {
  if (user.userType) return user.userType;
  const userType = localStorage.getItem("userType") ?? undefined;
  if (userType === "M" || userType === "L") {
    user.userType = userType;
  }
  if (userType) localStorage.removeItem("userType");
  return undefined;
};
const getName = () => {
  if (user.name) return user.name;
  const name = localStorage.getItem("name");
  if (name) {
    user.name = name;
  }
  return name ?? undefined;
};
const getEmail = () => {
  if (user.email) return user.email;
  const email = localStorage.getItem("email");
  if (email) {
    user.email = email;
  }
  return email ?? undefined;
};
const getTel = () => {
  if (user.tel) return user.tel;
  const tel = localStorage.getItem("tel");
  if (tel) {
    user.tel = tel;
  }
  return tel ?? undefined;
};
const isLogin = () => {
  return localStorage.getItem("token") != undefined;
};
export {
  clearUserInfo,
  getId,
  getName,
  getUserType,
  getEmail,
  getTel,
  isLogin,
};
