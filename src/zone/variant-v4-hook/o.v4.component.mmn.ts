import {App} from 'antd';
import type {MessageInstance} from 'antd/es/message/interface';
import type {ModalStaticFunctions} from 'antd/es/modal/confirm';
import type {NotificationInstance} from 'antd/es/notification/interface';

// ----------------------------------------------------------
let v4Message: MessageInstance;
let v4Notify: NotificationInstance;
let v4Modal: Omit<ModalStaticFunctions, 'warn'>;

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    const staticFunction = App.useApp();
    v4Message = staticFunction.message;
    v4Modal = staticFunction.modal;
    v4Notify = staticFunction.notification;
    return false;
};

export {v4Message, v4Notify, v4Modal};