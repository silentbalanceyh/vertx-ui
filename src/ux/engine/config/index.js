import form from './O.form';
/*
 */
import table from './O.table';
import query from './O.query';
import tab from './O.tab';
import dialog from './O.dialog';

import Dev from "../../develop";
import init from './O.init';
/*
 * 特殊运算，专用于新版的列宽度自适应运算
 */
import configScroll from './O.fn.scroll';

const exported = {
    ...form,
    ...table,
    ...query,
    ...tab,
    ...dialog,
    ...init,
    configScroll,
};
Dev.dgDebug(exported, "所有配置类方法", "#DAA520");
export default exported;