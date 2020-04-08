import datum from './datum';
import Opt from './option';
import Mode from './mode';
import V from './value';

export default {
    /*
     * array,
     * props,
     * state
     */
    ...datum,
    /**
     * ## 常量
     *
     * 列表专用 options 的键值
     *
     * @memberOf module:_constant
     */
    Opt,
    /**
     * ## 常量
     *
     * 列表模式，三种：
     *
     * * `list`：列表
     * * `add`：添加
     * * `edit`：编辑
     *
     * @memberOf module:_constant
     */
    Mode,
    /**
     * ## 常量
     *
     * 专用 Tabular/Category 对应的 type 常量
     *
     * @memberOf module:_constant
     */
    V,
}