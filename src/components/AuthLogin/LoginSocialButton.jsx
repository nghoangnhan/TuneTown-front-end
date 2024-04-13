import { createButton } from 'react-social-login-buttons';
// CONFIG FACEBOOK BUTTON 
const config = {
    text: "Login with Facebook",
    style: { background: "#5584e3" },
    activeStyle: { background: "#395897" },

};
/** My Facebook login button. */
export const LoginSocialButton = createButton(config);

