import pageHoc from './ox.page';
import controlHoc from './ox.control';
import Chn from '../channel';

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
export default (options = {}) => {
    if (!options.type) {
        throw new Error("[ Ox ] 对不起，渲染类型丢失！")
    }
    const pointer = hoc[options.type];
    return (target, property, descriptor) => {
        return class extends target {
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
        };
    }
}