import UseCookie from "../hooks/useCookie";

const userUtils = () => {
  const { getToken } = UseCookie();
  const CheckCookie = () => {
    const { access_token } = getToken();
    if (access_token) {
      return true;
    }
    return false;
  };
  return { CheckCookie };
};
export default userUtils;
//
