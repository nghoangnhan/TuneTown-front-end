import PropTypes from 'prop-types';
import { Modal } from 'antd';
import useConfig from '../../utils/useConfig';
import useChatUtils from '../../utils/useChatUtils';

const ModalApprove = ({ openApprovedList, setOpenApprovedList, converChosen }) => {
    const { Base_AVA } = useConfig();
    const userId = localStorage.getItem("userId");
    const { ApproveRequest } = useChatUtils();
    return (
        <Modal open={openApprovedList} onCancel={() => setOpenApprovedList(false)}
            footer={null} className="bg-backgroundModalPrimary dark:bg-backgroundDarkPrimary modalStyle" centered>
            <div className="flex flex-col items-center justify-center gap-3 p-5 bg-backgroundModalPrimary ">
                <h2 className="text-2xl font-bold text-primary dark:text-primaryDarkmode">Approved List</h2>
                <div className="w-full overflow-auto h-96">
                    {converChosen.approveRequests && converChosen.approveRequests.map((item) => (
                        <div className="flex flex-row items-center justify-around gap-2 rounded-md text-primaryText2 dark:text-primaryTextDark2 bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary" key={item.id}>
                            <img src={item.avatar ? item.avatar : Base_AVA} className="max-h-9" alt="" />
                            <h2 className="p-2">{item.userName}</h2>
                            <h2 className="p-2">{item.role}</h2>
                            <h2 className="flex gap-2 p-2">
                                <button className="w-20 px-2 py-1 border rounded-md border-primary dark:text-primaryDarkmode dark:border-primaryDarkmode text-primary hover:opacity-70"
                                    onClick={() => {
                                        ApproveRequest(userId, item.id, true).then(() => setOpenApprovedList(false)).catch((err) => console.log(err))
                                    }}>Approve</button>
                                <button className="w-20 px-2 py-1 text-red-600 border border-red-600 rounded-md dark:text-red-500 dark:border-red-500 hover:opacity-70"
                                    onClick={() => {
                                        ApproveRequest(userId, item.id, false).then(() => setOpenApprovedList(false)).catch((err) => console.log(err))
                                    }}>Reject</button>
                            </h2>
                        </div>)
                    )}
                </div>
            </div>
        </Modal>
    );
};

ModalApprove.propTypes = {
    openApprovedList: PropTypes.bool,
    setOpenApprovedList: PropTypes.func,
    converChosen: PropTypes.object
};

export default ModalApprove;