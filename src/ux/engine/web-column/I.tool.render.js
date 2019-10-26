// Expr
import Expr from "../expression";
import Abs from '../../abyss';
// 不同分流器
import On from './I.render.on';
import Out from './I.render.out';
import Cell from './I.render.cell';
import Jsx from './I.render.jsx';

export default {
    // ------- 静态
    ...On,
    // ------- 动态
    ...Cell,
    ...Out,
    // ------- Jsx
    ...Jsx,
    // ------- 初始化
    initEmpty: () => (Abs.clone({})),
    initDynamic: (params = {}) => Expr.applyDynamic(params.column),
    initConfig: () => (params = {}) => params.column["$config"] ? params.column["$config"] : {},

};