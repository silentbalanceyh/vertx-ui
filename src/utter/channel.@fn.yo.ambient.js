import Ux from 'ux';
import __SK from './channel.__.fn.seek.yo.processor';

export default (reference = {}, config = {}) => {
    const props = reference.props;

    // ----------------------- 全局专用信息 -----------------
    /*
     * $app
     * $user
     * $router
     * $menus
     * $query
     * $synonym
     * $setting
     * */
    const uniform = Ux.onUniform(props,
        "app", "user", "router",
        "menus", "query",
        "synonym", "setting"
    );
    {
        const user = uniform.$user;
        if (user && !user.is()) {
            const userData = Ux.isLogged();
            if (userData) {
                user.set(userData);
            }
        }
    }

    // ----------------------- 模型标识符 -----------------
    {
        const {$identifier, $refresh} = reference.props;
        if ($identifier) {
            uniform.$identifier = $identifier;
        }
        /*
         * 强制更新
         */
        if (undefined === $refresh) {
            const refresh = reference.state ? reference.state.$refresh : null;
            if (refresh) {
                uniform.$refresh = refresh;
            }
        } else {
            uniform.$refresh = $refresh;
        }
    }


    // ----------------------- 选项预处理 -----------------
    uniform.$options = __SK.seekCombine(reference); // _seedOptionPre(reference);

    // ----------------------- 禁用专用（特殊变量） -----------------
    // eslint-disable-next-line
    {
        /*
         * 特殊变量
         * $disabled
         */
        const {$disabled = false} = props;
        if ($disabled) {
            /* 只接收 $disabled = true */
            uniform.$disabled = $disabled;
        }
        /*
         * 状态检索：
         * $submitting：正在提交
         * $loading：正在加载
         * $dirty：脏数据
         */
        __SK.seekState(uniform, reference, "$submitting");
        /*
         * 特殊变量：
         * （主要用于配置无法处理继承的情况）
         * $selected：选中项
         */
        __SK.seekSelected(uniform, reference, "$selected");
    }


    // ----------------------- 函数继承 -----------------
    // eslint-disable-next-line
    {
        /*
         * 函数处理
         */
        Object.keys(props)
            .filter(propKey => !!propKey)
            .filter(propKey => Ux.isFunction(props[propKey]))
            .filter(Ux.isFunctionName)
            .forEach(propKey => uniform[propKey] = props[propKey]);
    }


    // ----------------------- 特殊引用 -----------------
    /*
     * 特殊引用
     * reference：父引用
     * react: 根引用
     */
    uniform.reference = reference;
    if (props.reference) {
        uniform.react = props.reference;
    } else {
        uniform.react = reference;
    }
    if (!uniform.config) uniform.config = {};


    // ----------------------- 插件模式 -----------------
    // eslint-disable-next-line
    {
        /*
         * 开合状态处理
         */
        const {
            // $collapsed = false, （开合取消）
            $plugins = {}
        } = reference.props;
        // uniform.$collapsed = $collapsed;
        if (!Ux.isEmpty($plugins)) {
            uniform.$plugins = $plugins;
        }
    }


    // ----------------------- 选项处理 -----------------
    // eslint-disable-next-line
    {
        /*
         * $options 选择
         */
        __SK.seekOption(uniform, reference);
    }
    Object.assign(uniform.config, config);


    // ----------------------- 辅助数据专用处理 -----------------
    // eslint-disable-next-line
    {
        /*
         * Assist数据专用
         */
        Ux.yoAide(reference, uniform);
        const {rxAssist} = reference.props;
        if (Ux.isFunction(rxAssist)) {
            uniform.rxAssist = rxAssist;
        }
    }


    // ----------------------- 动态Key处理 -----------------
    // eslint-disable-next-line
    {
        /*
         * 动态 $opKey
         */
        let {$opKey, $record, $workflow} = reference.props;
        if ($opKey) {
            uniform.$opKey = $opKey;
        } else {
            /*
             * 有状态才做二次读取
             */
            if (reference.state) {
                $opKey = reference.state.$opKey;
                if ($opKey) {
                    uniform.$opKey = $opKey;
                }
            }
        }
        /*
         * 添加的时候需要使用初始化的默认值
         * 所以引入外层变量 $record 来存储
         * 1）外层变量是单变量，主要用于记录拷贝
         * 2）如果是一个数组，必定会在Form中使用选择的方式，那么可以直接走 Assist
         * 3）外层变量同样会在 config 这个过程中引入特殊属性：rowData 用来设置选中记录
         */
        if ($record) {
            uniform.$record = $record;
        }
        /*
         * 工作流专用处理
         */
        if ($workflow) {
            uniform.$workflow = $workflow;
        }
    }


    // ----------------------- 视图功能 -----------------
    // eslint-disable-next-line
    {
        const {$myDefault} = reference.props;
        if ($myDefault) {
            uniform.$myDefault = $myDefault;
        } else {
            const $myDefault = Ux.fromHoc(reference, "myDefault");
            if ($myDefault) {
                Object.freeze($myDefault);
                uniform.$myDefault = $myDefault;
            }
        }
        __SK.seekState(uniform, reference, "$myView");  // 视图专用
        __SK.seekState(uniform, reference, "$qr");    // 查询条件专用
        // Fix: $synonym
        if (!uniform.hasOwnProperty('$synonym')) {
            __SK.seekState(uniform, reference, '$synonym');  //
        }
    }
    Object.freeze(uniform.config);          // 锁定配置，不可在子组件中执行变更
    return uniform;
};