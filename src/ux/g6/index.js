import func from './func';
import ui from './ui';
import library from './library'

export default {
    ...func,
    ...ui,
    ...library
    /* 共享事件专用处理，Ui类专用处理函数 */
    // ...ui,
    /* 特殊事件对象 */
    // g6Event: (reference) => new g6Event(reference),
}