import form from './O.form';
/*
 * 基本规范：
 * 1）cab类方法 -> 读取配置基本方法
 *    - cab会从 cab/cn/ 目录下读取静态配置
 *    - 如果配置来源并不是来自于静态配置，则不考虑
 * 2）cap类方法 -> 构造配置基本输入，在 raft 之前处理
 * 3）config类方法 -> 正式配置组件，初始化完成所有的静态配置
 */
import table from './O.table';
import query from './O.query';
import tab from './O.tab';
import dialog from './O.dialog';

import Dev from "../../develop";

const exported = {
    ...form,
    ...table,
    ...query,
    ...tab,
    ...dialog,
};
Dev.dgDebug(exported, "所有配置类方法", "#DAA520");
export default exported;