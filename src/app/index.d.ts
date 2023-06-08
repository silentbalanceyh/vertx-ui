declare module "app" {
    // --------------- 资源管理 ------------------
    export {default as Fn} from './function' // 函数库
    export {default as Ajax} from './action/Ajax' // Ajax库
    export {default as Tps} from './action/Types'; // Redux中定义的所有Types

    export {default as ViewTime} from './raft/ViewTime/UI';             // 运营时间
}