import __ZERO, {G6On} from 'zero'
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    ...__ZERO,
    G6On,       // 上册调用
    /* 共享事件专用处理，Ui类专用处理函数 */
    // ...ui,
    /* 特殊事件对象 */
    // g6Event: (reference) => new g6Event(reference),
}