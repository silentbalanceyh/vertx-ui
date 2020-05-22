import U from 'underscore';
import Unit from '../web-unit';

/**
 * ## 引擎函数
 *
 * 挂载 fnChild 专用函数，用于递归渲染
 *
 * 1. 消费变量为：reference.props.children
 * 2. 很多 Container 中会使用
 * 3. 将内容转接到 items 中，方便执行渲染
 *
 * @memberOf module:_to
 * @param {Array} items 需要挂载 fnChild 的核心配置。
 * @param {ReactComponent} reference React对应组件引用。
 * @param {ReactComponent} Component 组件类型。
 * @returns {Array} 返回处理完成后的配置。
 */
const toChildItem = (items = [], reference, Component) => {
    const {children} = reference.props;
    if (children) {
        let childRef = children;
        if (!U.isArray(children)) {
            childRef = [children];
        }
        items.forEach((item, index) => {
            const element = childRef[index];
            if (element) {
                item.fnChild = (extraAttrs = {}) => {
                    /* 必须在函数内作作用域处理 */
                    const {value} = reference.props;
                    return Unit.aiChild(element, Object.assign(extraAttrs, {value}));
                }
            }
            if (Component) {
                // 特殊注入，注入容器
                item.container = Component;
            }
        });
        /*
         * 变更过
         */
        return items;
    } else return items; // 无子组件直接返回
};

export default {
    toChildItem
}