import Types from './Types';

import Op from './op';
import Fun from './functions';
import Channel from './channel';
import I from './ajax';
import Qr from './query';

const exported = {
    /*
     * Redux 部分专用
     * 1) Types - `epicXxx`
     * 2) Epic - `epicXxx`
     * 3) Processor - `procXxx`
     */
    ...Types,
    /*
     * Ex.Op
     * $opLogin：登录专用
     */
    Op,
    /*
     * 1）`yo`调用
     * yoAmbient
     * yoComponent
     * yoSider
     * yoNavigation
     * yoHeader
     * yoAccount
     * 2) `yi`调用
     * 3) `yl`调用
     */
    ...Channel,
    /*
     * 全局函数
     * array,
     * props
     * state
     * metadata
     * promise
     * failure
     */
    ...Fun,
    I,
    /*
     * Qr 中不开放所有内容
     */
    ...Qr,
};
console.info(exported);
export default exported;