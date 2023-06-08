import serialFn from './cell.list.__.@fn.serial';
import phaseFn from './cell.list.__.@fn.phase';

export default (reference) => ({
    // 函数模式
    serial: serialFn(reference),
    phase: phaseFn(reference),
});