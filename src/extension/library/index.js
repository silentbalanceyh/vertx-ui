import Types from './Types';

import Op from './op';
import Fun from './functions';
import Channel from './channel';
import I from './ajax';
import Xui from './xui';
/*
 * Hoc 高阶组件
 */
import ox from './annotation/ox';
import Evt from './event';
import Sex from './romantic';
import Jsx from './jsx';

import Ux from 'ux';

const exported = {
    Jsx,
    /*
     * 新的Api处理
     */
    ...Sex,
    /*
     * 外置绑定，执行单个 fabric
     * et类的事件方法集合
     * 1）统一：etUniform
     * 2）串行：etSequence
     * 3）并行：etParallel
     */
    ...Evt,
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
    ...Xui,
    // 高阶组件专用
    ox,
};
if (Ux.Env.DEBUG) {
    console.groupCollapsed("%c 「 Ex 」 Zero Extension Framework ( Ex )", "font-weight:900;color:#228B22");
    console.info("「 Ex 」 Zero Common Library ( zero-ui include )", exported);
    console.groupEnd();
}
export default exported;