import QToolIr from './QtIr';
import Ux from 'ux';
import QConnect from './QtConnect';

export default {
    /*
     * 多值分析专用，只针对平行节点
     * {
     *     field1: "v1",
     *     field2: "v2"
     * }
     */
    analyze: (criteria: any = {}, reference = {}) =>
        Ux.parseInput(criteria, reference),
    /*
     * 树构造
     */
    ...QToolIr,
    /*
     * 树合并
     */
    ...QConnect,
};