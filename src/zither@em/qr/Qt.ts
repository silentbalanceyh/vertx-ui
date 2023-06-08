import QToolIr from './QtIr';
import __Zn from '../zero.module.dependency';

export default {
    /*
     * 多值分析专用，只针对平行节点
     * {
     *     field1: "v1",
     *     field2: "v2"
     * }
     */
    analyze: (criteria: any = {}, reference = {}) =>
        __Zn.parseInput(criteria, reference),
    /*
     * 树构造
     */
    ...QToolIr,
};