import {message} from 'antd';

const showSuccess = (config = {}) => {
    const {modal = {}} = config;
    message.config({maxCount: 1});
    const {success = {}} = modal;
    message.success(success.content, 1.2);
};

const showFailure = (config = {}) => {
    const {modal = {}} = config;
    message.config({maxCount: 1});
    const {error = {}} = modal;
    message.error(error.content, 2);
};

export default {
    showFailure,
    showSuccess,
}
