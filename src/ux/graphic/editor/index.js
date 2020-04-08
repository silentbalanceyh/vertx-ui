import ui from './ui';
import func from './func';

import g6Event from './event/O.event';

export default {
    ...func,
    /* 共享事件专用处理，Ui类专用处理函数 */
    ...ui,
    /* 特殊事件对象 */
    g6Event: (reference) => new g6Event(reference),
}