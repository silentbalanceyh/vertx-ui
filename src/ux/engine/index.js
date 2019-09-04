import datum from './datum';
import config from './config';
// 属性解析器 和 内置的表达式解析
import parser from './parser';
import expression from './expression';

import webComponent from './web-component';
import webNavigation from './web-navigation';
// 成套组件
import webField from './web-field';
import webUnit from './web-unit';
// 特殊函数
import functions from './functions';

export default {
    ...datum,
    ...config,

    ...parser,
    ...expression,
    ...functions,

    ...webComponent,
    ...webNavigation,
    ...webUnit,
    ...webField,
}