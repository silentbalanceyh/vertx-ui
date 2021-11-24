import U from 'underscore';
import Unit from '../web-unit';

const aiChildItem = (items = [], reference, Component) => {
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
    aiChildItem
}