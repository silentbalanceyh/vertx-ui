import func from './func';
import library from './library'
import ui from './ui';
import {DiMap as G6On} from './event/I.injections'

export default {
    ...func,
    ...library,
    ...ui,
    G6On,       // 上册调用
    /* 共享事件专用处理，Ui类专用处理函数 */
    // ...ui,
    /* 特殊事件对象 */
    // g6Event: (reference) => new g6Event(reference),
}