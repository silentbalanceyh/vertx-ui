import U from 'underscore';
import Unit from '../web-unit';
/*
 * 挂载 fnChild 专用函数，用于递归渲染
 * 1）消费变量为：reference.props.children
 * 2）很多 Container 中会使用
 * 3）将内容转接到 items 中，方便执行渲染
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
                item.fnChild = (extraAttrs = {}) =>
                    Unit.aiChild(element, extraAttrs)
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