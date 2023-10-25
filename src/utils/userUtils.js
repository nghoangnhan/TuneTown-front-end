import { auth } from "../api/config";

const userUtils = () => {
  const CheckCookie = () => {
    if (auth.access_token) {
      return true;
    }
    return false;
  };
  return { CheckCookie };
};
export default userUtils;
//
