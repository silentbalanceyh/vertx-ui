import U from 'underscore';
import Ux from 'ux';

export default (options = {}) => {
    /*
     * 抽取核心函数
     */
    const fnVerify = options.verify(options.type);
    const fnHoc = options.hoc(options.type);
    /*
     * Ex专用注解，高阶封装，对组件进行核心封装
     */
    return (target, property, descriptor) => {
        const fnInit = (ref, componentDidMount) => {
            let error = undefined;
            if (U.isFunction(fnVerify)) {
                // 包含了 fnVerify
                error = fnVerify(ref);
            }
            // 不验证的情况 error 就是 undefined
            if (!error) {
                if (U.isFunction(fnHoc)) {
                    fnHoc(ref, options.type).then(finished => {
                        if (finished) {
                            if (U.isFunction(componentDidMount)) {
                                /* options加载完成，并且没有错误的时候才执行 */
                                componentDidMount();
                            }
                        }
                    });
                }
            } else {
                ref.setState({error});
            }
        };
        // 防止 ... 操作到 undefined
        if (!options.state) options.state = {};
        // 定义新的 class
        return class hoc extends target {
            state = {
                error: undefined, // 默认的错误信息,
                ...options.state
            };

            componentDidMount() {
                fnInit(this, super.componentDidMount);
            }

            render() {
                const {error} = this.state;
                if (error) {
                    return Ux.fxError(error);
                } else {
                    /* 特殊变量必须保证 */
                    const {ready = false} = this.state;
                    return ready ? super.render() : false;
                }
            }
        }
    }
}