import __Zn from './zero.module.dependency';

const cabForm = (reference = {}, key = "form") => {
    const {$hoc} = reference.state;
    __Zn.fxTerminal(!$hoc, 10062, $hoc);
    const form = $hoc._(key);
    __Zn.fxTerminal(!form, 10056, $hoc);
    return __Zn.clone(form);
};

const capForm = async (reference = {}, config = {}, program = {}) => {
    const addOn = {};
    /*
     * 计算 supplier
     * 1）program 中的 supplier 最优先
     * 2）其次检查动态或静态，如果是
     *   - 静态：() -> config.form;
     *   - 动态：() -> supplier(magic);
     */
    let supplier;
    if (config.form) {
        /*
         * 静态模式
         * form足够
         */
        supplier = () => __Zn.promise(config.form);
    } else {
        if (config.control) {
            const {magic = {}, id = "", ...rest} = config.control;
            /*
             * 参数构造
             */
            const params = __Zn.parseInput(magic, reference);
            params.control = id;
            /*
             * 提取 generator
             */
            let generator;
            if (program.hasOwnProperty('supplier')) {
                generator = program['supplier'];
                if (__Zn.isFunction(generator)) {
                    supplier = () => generator(params);
                }
            } else {
                supplier = () => __Zn.asyncPromise(rest, params);
            }
        } else {
            console.error(config);      // 检查后端数据
            throw new Error("[ Ux ] Form无法初始化，检查配置数据！")
        }
    }
    /*
     * 1）读取最终 form 的配置
     */
    const form = await supplier();
    /*
     * 2）计算 columns
     */
    const {
        columns = 4, // 默认 4 列
        ...rest
    } = form;
    if (program.hasOwnProperty('columns')) {
        addOn.columns = program.columns;
    } else {
        addOn.columns = columns;
    }
    /*
     * 3）是否包含编程传入的 jsx
     */
    if (program.hasOwnProperty('renders')) {
        addOn.renders = {};
        const {renders = {}} = program;
        Object.keys(renders).filter(key => !!renders[key])
            .filter(key => __Zn.isFunction(renders[key]))
            .forEach(key => addOn.renders[key] = renders[key]);
    }
    /*
     * 4）是否包含了动态信息
     */
    if (program.hasOwnProperty('dynamic')) {
        addOn.dynamic = program.dynamic;
    }
    /*
     * 5）捆绑引用和ID
     */
    const {id = ""} = reference.props;
    addOn.id = id;
    if (!addOn.id) {
        // 修正 id 来源
        if (program.hasOwnProperty("id")) {
            addOn.id = program.id;
        }
    }
    addOn.reference = reference;
    /*
     * 6）权限控制
     */
    // TODO: 权限控制部分，用于控制 $op 的权限信息
    return {
        form: rest,
        addOn
    };
};
export default {
    cabForm,
    capForm,
}