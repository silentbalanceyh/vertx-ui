import Ux from "ux";
import __HOC from './annotation.__.fn.hoc.configuration';
import __Zn from './zero.module.dependency';

export default (options = {}) => {
    if (!options.type) {
        throw new Error("[ Ox ] 对不起，渲染类型丢失！")
    }
    const hocFn = __HOC[options.type];
    return (target, property, descriptor) => {
        return class extends target {
            constructor(props) {
                super(props);
                this.state = {$ready: false}
            }

            async componentDidMount() {
                if (Ux.isFunction(hocFn)) {
                    await hocFn(this);
                }
            }

            render() {
                return __Zn.yoRender(this, () => {
                    return super.render();
                }, options)
            }
        };
    }
}