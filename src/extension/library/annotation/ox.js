import pageHoc from './ox.page';
import controlHoc from './ox.control';
import Chn from '../channel';
import Ux from "ux";

const hoc = {
    "Page": pageHoc,
    "Control": controlHoc
};
/**
 * Origin X引擎专用注解。
 *
 * 使用方法：
 *
 * ```js
 * import Ex from 'ex';
 *
 * &#64;Ex.ox() -- 注释掉的调用方法，由于包含 @ 符号不可解析
 * class Component extends React.Component{
 *
 * }
 * ```
 *
 * @method @ox
 * @param {Object} options 配置项信息
 *
 */

/*
 * 防内存泄漏专用方法
 */
const unmount = (target) => {
    // 改装componentWillUnmount，销毁的时候记录一下
    let next = target.prototype.componentWillUnmount
    if (Ux.isFunction(next)) {
        target.prototype.componentWillUnmount = function () {
            if (next) next.call(this, ...arguments);
            this.unmount = true
        }
        // 对setState的改装，setState查看目前是否已经销毁
        let setState = target.prototype.setState
        target.prototype.setState = function () {
            if (this.unmount) return;
            setState.call(this, ...arguments)
        }
    }
}
export default (options = {}) => {
    if (!options.type) {
        throw new Error("[ Ox ] 对不起，渲染类型丢失！")
    }
    const pointer = hoc[options.type];
    return (target, property, descriptor) => {
        let Component = class extends target {
            constructor(props) {
                super(props);
                this.state = {$ready: false}
            }

            async componentDidMount() {
                await pointer.yiThis(this);
            }

            render() {
                return Chn.yoRender(this, () => {
                    return super.render();
                }, options)
            }
        }
        unmount(Component);
        return Component;
    }
}