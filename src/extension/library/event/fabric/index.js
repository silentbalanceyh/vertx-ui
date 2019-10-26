import etUniform from './workflow/fabric.fn.binder'
import etSequence from './workflow/fabric.fn.sequence'
import etParallel from './workflow/fabric.fn.parallel';
import etPure from './workflow/fabric.fn.pure';

export default {
    etUniform,      // etSequence + etParallel
    etSequence,     // 串行
    etParallel,     // 并行
    etPure,         // 纯处理，不带 name 和 target 的单独 Fabric 处理流程（用于非事件型重用）
}