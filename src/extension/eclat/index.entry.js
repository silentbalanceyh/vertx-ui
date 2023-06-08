/*
 * Ox可配置组件集合，所有可配置的组件从这里导出
 */
import {ExAdmin} from 'ei';
/*
 * Ox 连接组件
 */
import OxCard from './OxCard/UI';
import {OxList, OxTab} from "./Ox@Tab@List/UI";
/*
 * Ox 专用
 */
import __INDEX_ENTRY_UNLOCK from './index.entry.UNLOCK';
/*
 * eclat 中的所有组件都是配置过程中使用的组件
 * 1）这些组件只能出现在配置文件中，不可直接使用
 * 2）直接使用属于非法调用
 */
export default {
    ...__INDEX_ENTRY_UNLOCK,
    // OxAdmin -> ExAdmin 连接，OxAdmin属于可配置
    OxAdmin: ExAdmin,
    // OxCard -> PageCard 连接
    OxCard,
    OxTab,
    // OxList 中包含了 ExListComplex
    OxList,
}