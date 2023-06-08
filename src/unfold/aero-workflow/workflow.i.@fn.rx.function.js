import opFn from './workflow.__.fn.rx.op';

export default (reference) => ({
    // 关窗口
    rxClose: opFn.rxCloseFn(reference),
    // 打开行相关操作（行打开时需重新读取工作流）
    rxRow: opFn.rxRowFn(reference),
})