/*
 * Ox可配置组件集合，所有可配置的组件从这里导出
 */
import {ExAdmin} from 'ei';
/*
 * Ox 连接组件
 */
import OxCard from './OxCard/UI';
import OxCategory from './OxCategory/UI';

export default {
    // OxAdmin -> ExAdmin 连接，OxAdmin属于可配置
    OxAdmin: ExAdmin,
    // OxCard -> PageCard 连接
    OxCard,
    // OxCategory
    OxCategory,
}