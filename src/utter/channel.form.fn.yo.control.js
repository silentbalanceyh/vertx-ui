import Ux from 'ux';
import yoFilter from './channel.form.__.@fn.yo.filter';
import yoAmbient from './channel.@fn.yo.ambient';
import __V from './pedestal.v.constant.option';
import Fn from './idyl.zero.dependency';

const __rxClose = (reference, item = {}, isAdd = true) => (data = {}, addOn = {}) => {
    const {options = {}} = reference.state;
    if (!data.key) {
        console.error("[ Ex ] 传入数据没有 key，tab 操作会失败，请检查数据：", data);
    }
    if (options[__V.Opt.DYNAMIC_SWITCH] && isAdd) {
        Fn.rxTabEdit(reference)(data.key, data, item, {
            $submitting: false,
            $loading: true,
            ...addOn
        });
    } else {
        Fn.rxTabClose(reference)(data.key, {
            // $dirty: true,
            $submitting: false,
            $loading: true,
            ...addOn
        });
    }
    return Ux.promise(data);
};
const __yoForm = (additional = {}, reference) => {
    // 编程专用配置
    const program = Ux.clone(additional.form);
    /*
     * 输入专用处理：
     * 1）addOn.form：通过编程部分拿到的 form 信息
     * 2）S0（前端静态文件）_form：前端静态配置（主配置）——通常静态form使用此配置
     * 3）S1（前端静态文件）_formUp：前端静态配置（辅助配置）
     * 4）S2（前端静态文件）_formDown：前端静态配置（辅助配置）
     * 5）D0（后端处理）form：后端主配置
     * 6）D1（后端处理）formDown：后端主配置
     * 7）D2（后端处理）formUp：后端主配置
     * 布局专用处理
     * 1）（S0）标准前端静态
     * 2）（S0 + D0）：前端静态 + 后端主配置
     * 3）（S1 + S0/D0 + S2）：静态 + 动/静 + 静态
     */
    const formObj = {};
    formObj['FP'] = program;
    formObj['FF'] = Ux.fromHoc(reference, "form");
    formObj['FU'] = Ux.fromHoc(reference, "formUp");
    formObj['FD'] = Ux.fromHoc(reference, "formDown");
    /*
    * $options 是 yoAmbient 中会专用的，所以此处会使用三个核心值
    * {
    *     "form", "formUp", "formDown"
    * }
    * */
    const {$options = {}} = reference.props;
    if ($options.form) formObj['PFF'] = $options.form;
    if ($options['formUp']) formObj['PFU'] = $options['formUp'];
    if ($options['formDown']) formObj['PFD'] = $options['formDown'];
    /*
     * 读取 reference.state 中的表单信息
     */
    const {
        $formS = {},
        $formW
    } = reference.state;
    if ($formW) formObj['WFF'] = $formW;
    if ($formS.form) formObj['SFF'] = $formS.form;
    if ($formS['formUp']) formObj['SFU'] = $formS['formUp'];
    if ($formS['formDown']) formObj['SFD'] = $formS['formDown'];
    /*
     * 编排规则
     */
    const {
        formRules = [
            // -- 上半部分表单（编程的默认放在最前边）
            "FP",       // additional.form，编程模式表单
            "FU",       // hoc, _formUp, 配置模式表单
            "PFU",      // props, $options.formUp，属性传入表单
            "SFU",      // state, $formS.formUp, 状态传入表单
            // -- 主表单
            "FF",       // hoc, _form, （主表单）
            "PFF",      // props, $options.form, 属性传入表单
            "SFF",      // state, $formS.form, 状态传入表单
            "WFF",      // state, $formW ->, 工作流主表单（前后可动态）
            // -- 下半部分表单
            "FD",       // hoc, _formDown，配置模式表单下半部分
            "PFD",      // props, $options.formDown, 属性传入表单
            "SFD",      // state, $formS.formDown, 状态传入表单
        ]
    } = additional;
    let combine = {}
    formRules.map(formKey => formObj[formKey])
        .filter(formConfig => !!formConfig)
        .filter(Ux.isObject)
        .forEach(form => combine = Ux.toForm(combine, form));
    return combine;
}
const yoForm = (reference, additional = {}, data = {}) => {
    if (!additional) additional = {};
    const configuration = {};
    /*
     * 动态表单特殊配置
     * `magic`：特殊参数
     * `addon`：特殊配置
     * `control`：和后端的 UI_CONTROL 对应
     */
    if (additional.control) {
        configuration.magic = Ux.clone(additional.magic);
        configuration.addon = Ux.clone(additional.addon);
        configuration.control = additional.control;
    }
    const form = __yoForm(additional, reference);
    configuration.form = form;
    /*
     * {
     *     dialog: 窗口配置,
     *     modal：窗口回调信息,
     *     form：表单回调（开发型）
     * }
     * 上述配置只能二选一，原来 _seekForm 方法的内容
     * {
     *     "_dialog": "窗口数据",
     *     "_modal": "窗口回调消息",
     *     "_assist": "辅助数据",
     * }
     */
    const {dialog, model} = additional;
    {
        // 窗口专用配置「复制副本」
        const dialogConfig = {};
        if (dialog) {
            dialogConfig.dialog = Ux.clone(dialog);
        } else {
            const hocDialog = Ux.fromHoc(reference, "dialog");
            if (hocDialog) {
                dialogConfig.dialog = Ux.clone(hocDialog);
            }
        }
        // 回调消息专用配置
        if (model) {
            dialogConfig.modal = Ux.clone(model);
        } else {
            const hocModal = Ux.fromHoc(reference, "modal");
            if (hocModal) {
                dialogConfig.modal = Ux.clone(hocModal);
            }
        }
        // dialogConfig.modal 从 Form中读取配置
        if (!dialogConfig.modal && form.modal) {
            dialogConfig.modal = form.modal;
        }
        // 窗口处理后的配置
        if (dialogConfig.dialog) {
            configuration.dialog = {
                title: Ux.clone(dialogConfig.dialog),
                modal: dialogConfig.modal
            }
        }
        // 辅助数据专用
        const assist = Ux.fromHoc(reference, "assist");
        if (assist) {
            configuration.assist = Ux.clone(assist);
        }
    }
    const attrs = yoAmbient(reference);
    // 表单主配置
    attrs.config = Ux.clone(configuration);
    // transform 流程
    const $inited = Ux.clone(data);
    const {$addKey, $mode, $identifier} = reference.props;
    if ($addKey) {
        attrs.$addKey = $addKey;            /* 客户端提供主键 */
    }
    if ($mode) {
        attrs.$mode = $mode;                /* 表单模式 */
    }
    if ($identifier) {
        attrs.$identifier = $identifier;    /* 挂载 identifier 专用 */
    }
    // #ACL
    const {$edition} = reference.props;
    const acl = Ux.aclData($inited, reference, $edition);
    Object.assign(attrs, acl);              /* 表单控制专用（将控制写入到 attrs 中 */
    attrs.$inited = $inited;         /* Form 初始化数据 */
    if (!Ux.isFunction(attrs.rxClose)) {
        // [ Ux ] 核心错误！ Error: [ Ex ] rxClose 函数未出现在 props 中！
        attrs.rxClose = () => false;
    }
    // 新数据
    const {$subject = {}} = reference.state;
    attrs.$subject = $subject;
    return attrs;
};

const yoFormAdd = (reference, item = {}) => {
    const formAttrs = yoAmbient(reference);
    /*
     * 关闭函数
     */
    formAttrs.rxClose = __rxClose(reference, item);
    /*
     * 设置唯一的 $addKey
     * 这个值就是 Tab 中的 activeKey
     */
    formAttrs.$addKey = item.key;
    formAttrs.$mode = Ux.Env.FORM_MODE.ADD;
    /*
     * 读取 $identifier（动态表单必须）
     */
    const {options = {}, plugins = {}, $rowData, $submitting} = reference.state;
    if (options[__V.Opt.IDENTIFIER]) {
        formAttrs.$identifier = options[__V.Opt.IDENTIFIER];
    }
    /*
     * 提供 $query 用于处理特殊条件
     * Tabular / Category
     */
    const {$query = {}} = reference.props;
    formAttrs.$query = $query;
    /*
     * 插件
     */
    const $plugins = {};
    if (Ux.isFunction(plugins.pluginField)) {
        $plugins.pluginField = plugins.pluginField;
    }
    formAttrs.$plugins = $plugins;
    /*
     * 合并执行
     * 1. 从 formAttrs 中提取 $record 专用上层变量
     * 2. 在 $record 变量中挂载 rowData 属性
     * 3. 将 $record 直接传入到底层数据中
     */
    if (!formAttrs.$record) formAttrs.$record = {};
    if ($rowData) formAttrs.$record.rowData = $rowData;
    formAttrs.rxSubmitting = Ux.rxSubmitting(reference);
    formAttrs.$submitting = $submitting;
    return formAttrs;
}

const yoFormEdit = (reference, item = {}) => {
    const formAttrs = yoAmbient(reference);
    /*
     * 关闭函数
     */
    formAttrs.rxClose = __rxClose(reference, item, false);
    formAttrs.rxView = Fn.rxView(reference);
    /*
     * 设置 state -> $dirty
     */
    formAttrs.$mode = Ux.Env.FORM_MODE.EDIT;
    /*
     * 读取 $identifier（动态表单必须）
     */
    const {options = {}, plugins = {}, $submitting} = reference.state;
    if (options[__V.Opt.IDENTIFIER]) {
        formAttrs.$identifier = options[__V.Opt.IDENTIFIER];
    }
    /*
     * 设置表单初始值
     */
    const {$inited = {}, $rowData} = reference.state;
    formAttrs.$inited = $inited;
    /*
     * 表单编辑的优雅转换
     *
     */
    const $plugins = {};
    if (Ux.isFunction(plugins.pluginRow)) {
        /*
         * 标准的编辑内容
         */
        $plugins.pluginForm = plugins.pluginRow;
    }
    if (Ux.isFunction(plugins.pluginField)) {
        $plugins.pluginField = plugins.pluginField;
    }
    formAttrs.$plugins = $plugins;
    /*
     * 设置基础查询条件
     */
    const {$query = {}} = reference.props;
    formAttrs.$query = $query;
    /*
     * 合并执行
     * 1. 从 formAttrs 中提取 $record 专用上层变量
     * 2. 在 $record 变量中挂载 rowData 属性
     * 3. 将 $record 直接传入到底层数据中
     */
    if (!formAttrs.$record) formAttrs.$record = {};
    if ($rowData) formAttrs.$record.rowData = $rowData;
    // 防重复提交
    formAttrs.rxSubmitting = Ux.rxSubmitting(reference);
    formAttrs.$submitting = $submitting;
    return formAttrs;
}
export default {
    yoFilter,
    yoForm,
    yoFormAdd,
    yoFormEdit,
}