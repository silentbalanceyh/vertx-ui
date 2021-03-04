// UI_LAYOUT 表访问
// 子类表单需要使用，如 IxDatabase, IxIntegration 等
import I from "../ajax";
import Ux from "ux";
import {HocI18r} from 'entity';
import Yo from "./yo";
import Fn from "../functions";

const yiRouterType = (reference, state = {}) => {
    const $query = Ux.cabQuery(reference);
    if ($query) {
        const {$router} = reference.props;
        const params = $router.params();
        if (params.type) {
            $query.criteria['type,='] = params.type;
        }
        if (params.status) {
            $query.criteria['status,='] = params.status;
        }
        if (1 < Object.keys($query.criteria).length) {
            $query.criteria[''] = true;
        }
        /*
         * 构造 state
         */
        state.$query = $query;
    }
    return Ux.promise(state);
}

/*
 * 1）controlId，UI_CONTROL 的 Id信息
 * 2）type，类型，LIST / FORM / COMPONENT
 * 3）webId，如果是 FORM 则是 formId，如果是 LIST 则是 listId
 */
/**
 * ## 「通道」`Ex.yiControl`
 *
 * ### 1. 基本介绍
 *
 * 控件专用处理，从后端读取配置：UI_CONTROL / UI_FORM / UI_LIST
 *
 * 1. 单参，直接提取控件配置
 * 2. 双参，根据`control`和类型`type`执行控件配置提取（包括Form和List）。
 *
 *
 *
 * @memberOf module:_channel
 * @method yiControl
 * @param {arguments} [arguments] 可选参数，变参
 * @returns {Promise<T>} 返回最终的 Promise。
 */
function yiControl() {
    if (1 === arguments.length) {
        const control = arguments[0];
        const config = Yo.yoControl(control);
        return Ux.promise(config);
    } else {
        const control = arguments[0];
        const type = arguments[1];
        /*
         * 合并处理，得到最终的 control 级别的配置
         */
        const ajaxControl = I.control({type, control});
        const ajaxOp = I.ops({control, type: "OP"});
        const parser = Fn.parserOfButton(null);     // 这个操作可以 null 的引用
        return Ux.parallel([ajaxControl, ajaxOp], "config", "ops").then(response => {
            const {config = {}, ops = []} = response;
            /*
             * 操作专用 __acl 处理
             */
            if ("LIST" === type) {
                Ux.aclOp(config.options, ops);
            }
            return parser.parseControl(config, {type, ops}, true);
        }).catch(console.error);
    }
}


/**
 * ## 扩展函数
 *
 * 标准核心模块专用方法，内部调用函数
 *
 * 1. yiModule
 * 2. 路由信息：/xxx/yyy/:type --> type,= <value>
 * 3. yiAssist
 *
 * @memberOf module:_channel
 * @method yiStandard
 * @param {ReactComponent} reference React对应组件引用
 * @param {State} inputState 返回当前组件状态
 * @returns {Promise<T>} 执行更新过后的状态
 */
const yiStandard = (reference, inputState) => {
    /*
     * 读取参数信息
     */
    const state = {};
    if (Ux.isObject(inputState)) {
        Object.assign(state, inputState);
    }
    return yiModule(reference, state)
        /* 第一种用法 */
        .then(Ux.pipe(reference))
        .then(data => yiAssist(reference, data))
        .then(data => yiRouterType(reference, data))
        /* 第二种用法 */
        .then(Ux.ready)
}
/**
 * ## 「通道」`Ex.yiCompany`
 *
 * 带有企业信息页面的专用处理流程，主要用于查询条件设置。
 *
 * 1. 员工页面
 * 2. 部门页面
 * 3. 组页面
 * 4. 分公司页面
 *
 * 为这些页面注入 `companyId` 的查询条件，直接根据 $query 的查询条件注入特定条件：
 *
 * ```
 * companyId,=<公司ID值>
 * ```
 *
 * 这里的companyId的数据源来自于props中的`$inited.key`变量，最终会生成特定的$query存储在
 * reference的state状态信息中，构造特定查询条件，不仅如此，`companyId,=`的条件会注入到Qr流程，挂载到
 * `$query`的`criteria`节点中。
 *
 * @memberOf module:_channel
 * @method yiCompany
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Promise<T>} 返回Promise。
 */
const yiCompany = (reference) => {
    const state = Yo.yoAmbient(reference);
    /*
     * 处理 $query 部分的信息
     */
    const $query = Ux.cabQuery(reference);
    if ($query) {
        /*
         * 追加条件进入到 criteria
         */
        if (!$query.criteria) $query.criteria = {};
        /*
         * 双条件合并，大于0的时候需要取新条件
         */
        if (0 < Object.keys($query.criteria).length) {
            $query.criteria[''] = true;
        }
        const {$inited = {}} = reference.props;
        $query.criteria['companyId,='] = $inited.key;
        state.$query = $query;
    }
    return yiAssist(reference, state)
        .then(Ux.ready)
}
/**
 *
 * @memberOf module:_channel
 * @param ref
 * @param config
 * @param inherit
 * @returns {Object}
 */
const yiPartForm = (ref, config = {}, inherit = true) => {
    /*
    * segment
    * 1) direct = false
    * -- 表示当前为自定义控件，不执行 Ant-Form 的直接绑定
    * 2）direct = true
    * -- 表示当前为非自定义控件，执行 Ant-Form 的直接绑定（标准表单）
    * */
    const form = Ux.fromHoc(ref, "form");
    let reference;
    if (inherit) {
        /*
         * Form 直接从父类继承，绑定到 Ant-Form 中的 form 变量里
         * 这种情况下会包含 onChange 的 native 方法
         */
        reference = Ux.onReference(ref, 1);
    } else {
        /*
         * Form 不继承父类信息，位于自定义控件内部，不绑定到 Ant-Form 中的 form 变量
         * 这种情况下会执行外部的 onChange（自定义组件内部专用）
         */
        reference = ref;
    }
    const {renders = {}, onChange = {}, ...rest} = config;
    const raft = Ux.configForm(form, {
        reference,
        ...rest,
        renders,
    })
    const state = {};
    if (!Ux.isEmpty(onChange)) {
        state.$onChange = onChange;
    }
    state.$form = raft;
    /* 传入状态 */
    const inputState = config.state;
    if (inputState) {
        Object.assign(state, inputState);
    }
    return Ux.promise(state);
}
/**
 * ## 「通道」`Ex.yiColumn`
 *
 * ### 1. 基本介绍
 *
 * 列渲染专用处理函数，用于处理`USER`特殊类型的`$render`执行数据预处理
 *
 * 1. 提取所有`USER`列相关信息。
 * 2. 根据传入数据执行`$lazy`的计算（预处理Ajax，系统中唯一调用`Ux.ajaxEager`的位置。
 *
 * 这种类型的代码流程如下：
 *
 * |步骤|含义|
 * |---:|:---|
 * |1|扫描表格配置`table`中的`columns`节点。|
 * |2|从`columns`节点中抽取`$render = USER`的列类型。|
 * |3|收集所有这种类型，执行单独的参数合并，数据条目的读取和辅助数据读取请求不对等，可能10条数据由于某个字段值一样只读取四次。|
 * |4|构造state中的`$lazy`变量：一个Object类型。|
 *
 * ### 2. 关于`$lazy`的结构
 *
 * #### 2.1. 数据
 *
 * ```json
 * [
 *      { "type": "type1", "name": "记录1" },
 *      { "type": "type1", "name": "记录2" },
 *      { "type": "type1", "name": "记录3" },
 *      { "type": "type2", "name": "记录4" },
 *      { "type": "type2", "name": "记录5" },
 *      { "type": "type2", "name": "记录6" }
 * ]
 * ```
 *
 * #### 2.2. 辅助数据
 *
 * ```json
 * [
 *      { "key": "type1", "name": "类型1" },
 *      { "key": "type2", "name": "类型2" }
 * ]
 * ```
 *
 * #### 2.3. 最终生成的变量
 *
 * ```json
 * {
 *     "type":{
 *          "type1": "类型1",
 *          "type2": "类型2"
 *     }
 * }
 * ```
 *
 * * 上述结构中`type`是数据记录中的属性。
 * * 而`Object`中的数据就是`type`对应的：`值 = 显示文字`的Map字典。
 *
 * @memberOf module:_channel
 * @method yiColumn
 * @param {ReactComponent} reference React对应组件引用
 * @param {State} initState 返回当前组件状态
 * @param {Object} $data 搜索的最终结果，$data.list 中包含数据
 * @returns {Promise<T>} 执行更新过后的状态
 */
const yiColumn = (reference, initState = {}, $data = []) => {
    initState = Ux.clone(initState);
    const {$table} = initState;
    if ($table.columns) {
        const lazyColumn = $table.columns
            .filter(item => "USER" === item['$render']);
        return Ux.ajaxEager(reference, lazyColumn, $data ? $data.list : [])
            .then($lazy => Ux.promise(initState, "$lazy", $lazy))
            .then(state => Ux.promise(state, "$data", $data));
    } else {
        console.error("Table columns error: ", $table);
    }
}
/**
 * ## 「通道」`Ex.yiAssist`
 *
 * ### 1. 输入来源
 *
 * |来源|含义|
 * |:---|:---|
 * |`cab/<LANG>`|资源目录`cab/<LANG>/`中绑定的资源文件的_assist节点，使用`@zero`绑定。|
 * |config|直接从props中读取配置，消费assist节点，这种通常是配置型。|
 *
 * ### 2. 辅助数据种类
 *
 * 示例中的数据结构直接从`_assist`开始，或`config.assist`开始，它包含了多个键值配置，每个配置如下：
 *
 * |节点|含义|
 * |:---|:---|
 * |uri|Ajax远程方法的Uri地址。|
 * |method|默认`GET`，可修改成其他方法来读取。|
 * |magic|新版查询模式，非查询引擎，直接将magic节点佐为查询条件。|
 * |params.criteria|这种通常是`qr=true`，设置查询引擎。|
 * |qr|（Boolean）是否强制性使用查询引擎，强制使用则会触发后端查询引擎。|
 * |response|配置响应数据的特殊属性，主要用来配置记录主键。|
 * |group|这个配置目前仅用于`X_TABULAR`读取，根据某个字段进行分组，然后使用值构造变量。|
 *
 * #### 2.1. 非`X_TABULAR`类型
 *
 * > 这种类型比较自由，读取任意接口或任意表都可以。
 *
 * ```json
 * {
 *      "model.information": {
 *          "uri": "/api/model/full/read",
 *          "response": {
 *              "key": "id"
 *          }
 *      },
 *      "model.resource":{
 *          "uri": /api/model/resource"
 *      }
 * }
 * ```
 *
 * 上边的配置信息会在state中生成两个变量，这种模式的变量名直接根据配置中的Object属性字段来定义。
 *
 * * `$a_model_information`
 * * `$a_model_resource`
 *
 * #### 2.2. `X_TABULAR`类型
 *
 * > 这种类型只读取`X_TABULAR`的数据类型，而且会提供`group`方法执行分组，通常是`TYPE`字段。
 *
 * ```json
 * {
 *      "tabular": {
 *          "uri": "/api/types/tabulars",
 *          "method": "POST",
 *          "magic": {
 *              "$body": [
 *                  "permission.type",
 *                  "member.card"
 *              ]
 *          },
 *          "group": "type"
 *      }
 * }
 * ```
 *
 * 上边配置生成的变量为：
 *
 * * `$t_permission_type`
 * * `$t_member_card`
 *
 * ### 3. Js脚本
 *
 * #### 3.1. 调用代码
 *
 * 框架内部的调用代码如下：
 *
 * ```js
 * import Ex from 'ex';
 *
 * const state = {};
 * Ex.yiAssist(reference, state).then(response => {
 *     // response 变量中会包含执行 assist 辅助数据流程后的变量
 *     // 假设使用了 2.1 和 2.2 的综合配置
 *     // 则会生成下边四个属性
 *     // - $a_model_information，数据类型是 DataArray
 *     // - $a_model_resource，数据类型是 DataArray
 *     // - $t_permission_type，数据类型是 DataArray
 *     // - $t_member_card，数据类型是 DataArray
 * })
 * ```
 *
 * #### 3.2. 提取数据代码
 *
 * ```js
 * import Ux from 'ux';
 *
 * // 直接传入原始key，会直接做转换
 * // member.card，系统会检索读取上述列表中的 $t_member_card 变量的值
 * // 返回值为 Array 类型。
 * const memberCard = Ux.onDatum(reference, "member.card");
 * ```
 *
 * #### 3.3. Datum函数
 *
 * 除开直接读取的`onDatum`以外，还可以使用一些带有`Datum`关键字的函数，例如：
 *
 * |Datum函数|纯函数|
 * |:---|:---|
 * |elementFindDatum|elementFind|
 * |elementUniqueDatum|elementUnique|
 * |elementGroupDatum|elementGroup|
 *
 * 带`Datum`的函数会比纯函数多两个参数，前两个参数就是`onDatum`的两个参数，简单说是`Datum`遵循如下代码执行流程：
 *
 * |步骤|执行代码|
 * |---:|:---|
 * |1|输入`reference`和`sourceKey`（上述调用代码第二参）。|
 * |2|调用onDatum抽取函数，生成数据（Array类型）。|
 * |3|执行主方法，纯函数中的方法，以Array数据为基础。|
 *
 * @memberOf module:_channel
 * @method yiAssist
 * @param {ReactComponent} reference React对应组件引用
 * @param {State} state 输入状态，计算之前的
 * @returns {Promise<T>} 执行更新过后的状态，计算之后的
 */
const yiAssist = (reference, state = {}) => {
    /*
     * Assist 专用数据
     */
    const assist = Ux.fromHoc(reference, "assist");
    /*
     * keys / promise
     */
    if (assist) {
        /*
         * 第一选择
         */
        return Ux.asyncAssist(assist, reference, state);
    } else {
        const {config = {}} = reference.props;
        if (config.assist) {
            /*
             * 第二选择
             */
            return Ux.asyncAssist(config.assist, reference, state);
        } else return Ux.promise(state);
    }
}
// X_MODULE

/**
 * ## 扩展函数
 *
 * 一个 module 的配置信息来源于三部分：
 *
 * 1. `UI.json`：静态配置，会在 reference 中生成 $hoc 变量
 * 2. 远程的 UI_MODULE中的 metadata 字段
 *      * （默认值）最初的 metadata 字段为 FILE 模式（即文件路径）
 *      * （动态管理）如果管理过程中执行了更新，那么直接就是 metadata 的内容
 * 3. 如果 standard = false 那么不考虑 $hoc 的生成，而是直接使用 hoc 变量
 *      * 这种情况不引入 HocI18r 同样不引入 HocI18n 两个数据结构
 * 4. 如果 `standard = true` 那么有两种可能
 *      * 已经绑定过 UI.json，则使用混合模式（远程优先）
 *      * 未绑定过 UI.json，则直接使用远程模式
 *
 * @memberOf module:_channel
 * @method yiModule
 * @param {ReactComponent} reference React对应组件引用
 * @param {State} state 返回当前组件状态
 * @param {boolean} standard 是否执行标准化
 * @returns {Promise<T>} 执行更新过后的状态
 */
const yiModule = (reference, state = {}, standard = true) => {
    const {$router} = reference.props;
    if (!$router) {
        throw new Error("[ Ex ] $router变量丢失！");
    }
    /*
     * 读取路径
     */
    const path = $router.path();
    return I.module(path).then(module => {

        if (module && !Ux.isEmpty(module.metadata)) {
            /*
             * HocI18n 的协变对象，用于处理远程
             */
            if (standard) {
                /*
                 * 没有 $hoc 变量证明没有静态导入，才会执行该操作
                 * 仅提供远程的操作
                 */
                const {$hoc} = reference.state;
                if ($hoc) {
                    /* 混合模式 */
                    state.$hoc = $hoc.merge(module.metadata);
                } else {
                    state.$hoc = new HocI18r(module.metadata);
                }
            } else {
                /*
                 * 前端静态 + 后端动态
                 */
                state.hoc = module.metadata;
            }
        }
        return Ux.promise(state);
    });
}

const _isDynamic = ($router) => {
    let params = $router.params();
    if (!params) params = {};
    /*
     * 路径
     */
    const path = $router.path();
    const app = Ux.Env['ROUTE'];
    /*
     * 计算 prefix
     */
    const prefix = `/${app}/ui/`;
    if (path.startsWith(prefix)) {
        const {module, page} = params;
        if (module && page) {
            return {app, module, page}
        }
    }
};
/*
 * 处理
 * $container：容器配置
 * $component：内部组件配置
 */
const _seekPage = (reference, state = {}) => {
    const {$output = {}} = state;
    /*
     * $container 解析
     */
    if ($output.layout && !Ux.isEmpty($output.layout)) {
        const $layout = {};
        const {layout = {}} = $output;
        $layout.key = `layout-${layout.key}`;
        $layout.config = layout.config ? layout.config : {};
        /*
         * 解析基础
         */
        $layout.name = layout.name;
        state.$tpl = $layout;
    }
    /*
     * $container 解析
     */
    if ($output['containerName']) {
        const $container = {};
        $container.name = $output['containerName'];
        $container.config = $output['containerConfig'] ? $output['containerConfig'] : {};
        // 解决底层 $metadata 没有值的 BUG
        $container.key = `container-${$output.key}`;
        $container.pageId = $output.key;
        state.$container = $container;
    } else {
        state.$container = false;
    }
    /*
     * $component 解析
     * 1）页面是否安全
     * 2）assist专用配置
     * 3）grid专用配置
     * 4）controls配置
     */
    state.$secure = $output.secure;                         // 重写该属性，鉴别安全页面
    state.$grid = $output.grid ? $output.grid : [];         // 注意数据格式是 []
    state.$assist = $output.assist ? $output.assist : {};
    state.$controls = $output.controls ? $output.controls : {};
    return Ux.promise(state);
};
/*
 * 设置渲染信息
 * $dynamic：
 * = true：动态渲染，Ox Engine
 * = false：静态渲染，Zero UI
 */
const _seekRoute = (reference, state = {}) => {
    const {$router} = reference.props;
    if ($router) {
        /*
         * 动态静态分离
         */
        const extracted = _isDynamic($router);
        if (extracted) {
            Ux.dgDebug(extracted, "[ Ex ] 页面参数: ", "#CD3333");
            state.$input = extracted;
            state.$dynamic = true;
        } else {
            state.$dynamic = false;
            state.$secure = true;       // 静态默认必须是 $secure 的
        }
    } else {
        throw new Error("[ ExR ] $router 变量不存在，检查配置！");
    }
};
const startAsync = (state) => {
    /*
     * 两种情况下需要清空
     * 1）动态页面和动态页面切换时
     * 2）动态页面和静态页面切换时
     */
    state.$tpl = {};
    state.$container = {};
    state.$grid = {};
    state.$assist = {};
    // state.$hoc = null;      // Zero 控制
    state.$controls = {};
    return Ux.promise(state);
};
/**
 * ## 扩展函数
 *
 * ### 模板专用处理器
 *
 * 1. 静态模板
 * 2. 动态模板
 *
 * ### 动态模板判断
 *
 * 1. $router 中的 path 路径以：/ui/ 开头
 * 2. $router 中的参数同时包含：module / page
 *
 * 最终返回 `{ app, module, page }`
 *
 * * $container：容器配置
 * * $component：内部组件配置
 *
 * ### 渲染计算
 *
 * $dynamic：
 *
 * * = true：动态渲染，Ox Engine
 * * = false：静态渲染，Zero UI
 *
 * @memberOf module:_channel
 * @method yiLayout
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Promise<T>} 执行更新过后的状态
 */
const yiLayout = (reference) => {
    /*
     * $router检查
     */
    const state = {};
    _seekRoute(reference, state);
    /*
     * 动态和静态
     */
    return (state.$dynamic ?
            startAsync(state)
                /* 先读取模块相关数据 */.then(data => yiModule(reference, data))
                /* 再读取页面 */.then(data => I.page(data.$input)
                /* 将页面数据加入 */.then(page => Ux.promise(data, '$output', page)))
                /* 填充 Container / Component 专用配置 */.then(data => _seekPage(reference, data)) :
            startAsync(state)
    ).then(Ux.ready);
}
export default {
    yiPartForm,
    yiColumn,
    yiStandard,
    yiModule,
    yiLayout,
    yiAssist,
    yiControl,
    yiCompany,
}