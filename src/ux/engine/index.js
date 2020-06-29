import datum from './datum';
import config from './config';
/*
 * 1）属性解析器
 * 2）表达式解析器
 * 3）查询引擎
 */
import parser from './parser';
import expression from './expression';
import query from './query';
// 成套组件
import webComponent from './web-component';
import webNavigation from './web-navigation';
import webField from './web-field';
import webColumn from './web-column';
import webUnit from './web-unit';
import webOp from './web-op';
// 特殊函数
import functions from './functions';
// 特殊方法处理布局
import Lt from './layout';

export default {
    ...datum,
    ...config,

    ...parser,
    ...expression,
    ...query,
    ...functions,

    ...webComponent,
    ...webNavigation,
    ...webUnit,
    ...webField,
    ...webColumn,
    ...webOp,
    aiLayout: Lt.aiLayout
}