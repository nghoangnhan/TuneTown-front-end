import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UseCookie from '../hooks/useCookie';
import PropTypes from 'prop-types';
import useUserUtils from '../utils/useUserUtils';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line no-unused-vars
const AuthorizationModal = ({ isAdmin, isArtist }) => {
    const userRole = localStorage.getItem("userRole");
    const navigate = useNavigate();
    const { getToken, removeToken } = UseCookie();
    const { access_token } = getToken();
    const { checkToken } = useUserUtils();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
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
            if (res == false) {
                setOpen(true);
            }
        });
    }, [access_token]);

    return (
        <Modal
            title={t('auth.authorModal')}
            centered
            open={open}
            okButtonProps={{
                className: "bg-primary text-white hover:opacity-70 dark:bg-primaryDark dark:text-white dark:hover:opacity-70",
            }}
            onOk={handleOK}
            className='modalStyle'
            cancelButtonProps={{ hidden: true, }}>
            {userRole === "ADMIN" && <p className='text-primaryText2 dark:text-primaryTextDark2'>{t("auth.authorModalAdmin")}</p>}
            {userRole === "ARTIST" && <p className='text-primaryText2 dark:text-primaryTextDark2'>{t("auth.authorModalArtist")}</p>}
            {userRole !== "ADMIN" && userRole !== "ARTIST" && <p className='text-primaryText2 dark:text-primaryTextDark2'>{t("auth.authorModalUser")}</p>}
        </Modal>
    );
};

AuthorizationModal.propTypes = {
    isAdmin: PropTypes.bool,
    isArtist: PropTypes.bool,
};

export default AuthorizationModal;