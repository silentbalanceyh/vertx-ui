/*
 * Redux部分
 */
import T from './Types';
import E from './Epic';
/*
 * Exported部分
 */
import I from './api';
import O from './op';
import U from './ui';
/*
 * Channel通道部分
 */
const exported = {
    T, // Pre：Redux中需要连接的 Types
    E, // Pre: Redux中的 Epics
    I, // Ajax专用汇总接口
    O, // Act（按钮独特函数）
    U, // UI配置信息,
};
console.info(exported);
export default exported;