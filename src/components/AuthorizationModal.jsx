import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UseCookie from '../hooks/useCookie';
import PropTypes from 'prop-types';
import useUserUtils from '../utils/useUserUtils';

// eslint-disable-next-line no-unused-vars
const AuthorizationModal = ({ isAdmin, isArtist }) => {
    const [open, setOpen] = useState(false);
    const userRole = localStorage.getItem("userRole");
    const navigate = useNavigate();
    const { getToken, removeToken } = UseCookie();
    const { access_token } = getToken();
    const { checkToken } = useUserUtils();
    const handleOK = () => {
        removeToken();
        navigate("/login");
        setOpen(false);
    };
    // const handleCancel = () => {
    //     setOpen(false);
    // };
    useEffect(() => {
        checkToken().then((res) => {
            if (res === false) {
                setOpen(true);
            }
        });
    }, [access_token]);

    return (
        <Modal
            title="Authorization Error"
            centered
            open={open}
            okButtonProps={{
                className: "bg-primary text-white hover:opacity-70 dark:bg-primaryDark dark:text-white dark:hover:opacity-70",
            }}
            onOk={handleOK}
            className='modalStyle'
            cancelButtonProps={{ hidden: true, }}>
            {userRole === "ADMIN" && <p className='text-primaryText2 dark:text-primaryTextDark2'>You are not authorized to access ADMIN PAGE</p>}
            {userRole === "ARTIST" && <p className='text-primaryText2 dark:text-primaryTextDark2'>You are not authorized to access ARTIST PAGE</p>}
            {userRole !== "ADMIN" && userRole !== "ARTIST" && <p className='text-primaryText2 dark:text-primaryTextDark2'>You are not authorized to access this page</p>}
        </Modal>
    );
};

AuthorizationModal.propTypes = {
    isAdmin: PropTypes.bool,
    isArtist: PropTypes.bool,
};

export default AuthorizationModal;