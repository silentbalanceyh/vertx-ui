import Ux from 'ux';
import Init from './Op.Init';

const $opConnect = (reference) => Ux.ai2Event(reference, (values) => {
    const {source = {}} = values;
    if (!source.jdbcUrl) {
        Ux.showDialog(reference, "jdbc");
    } else {
        // 连接检查专用
        Ux.rdxSubmitting(reference);
        Ux.ajaxPost(`/api/connect`, source).then(response => {
            const result = response.result;
            if ("FAILURE" === result) {
                // 数据库连接失败
                Ux.showDialog(reference, "connect", () =>
                    Ux.rdxSubmitting(reference, false));
                reference.setState({$connected: false});
            } else {
                // 数据库连接成功
                Ux.showDialog(reference, "connected", () => {
                    Ux.rdxSubmitting(reference, false);
                    reference.setState({$connected: true});
                })
            }
        });
    }
});

const _nextPhase = (reference, values) => {
    // 提交前的数据处理，每一步都使用表单数据处理 $data
    let {$data = {}} = reference.state;
    if ($data && values) {
        // 拷贝触发状态更新
        $data = Ux.clone($data);
        Ux.dgDebug(values, "[OXD] 表单提交数据：");
        Object.assign($data, values);
        reference.setState({$data});
    }
    // 构造本地Promise
    return Promise.resolve($data);
};
const _nextTab = (reference) => {
    let {$activeKey = "keyBasic"} = reference.state;
    if ("keyBasic" === $activeKey) {
        $activeKey = "keySource";
    } else if ("keySource" === $activeKey) {
        $activeKey = "keyInit";
    }
    return $activeKey;
};
const _verifySource = (reference) => {
    const {$connected = false} = reference.state;
    return !$connected;
};
const _nextStep = (reference) => ($data) => {
    // 读取上级引用，并且改变上级的Tab页处理
    const ref = Ux.onReference(reference, 1);
    const $activeKey = _nextTab(ref);
    // 设置激活的tab和选中项
    ref.setState({$data, $activeKey});
};
const _nextStep2 = (reference) => ($formData = {}) => {
    // 读取上级引用，并且改变上级的Tab页处理
    const ref = Ux.onReference(reference, 1);
    const $activeKey = _nextTab(ref);
    // 设置激活的tab和选中项，合并到状态数据中
    const {$data = {}} = ref.state;
    Object.assign($data, $formData);
    Ux.ajaxGet("/api/app/pre-init", {name: $data.name})
        .then(response => {
            // 处理$initData变量，将把该变量作为核心参数传入到最后一个初始化界面
            ref.setState({$data, $activeKey, $initData: Ux.clone(response)});
        });
};
const $opReset = (reference) => (event) => {
    event.preventDefault();
    Ux.formReset(reference);
};
const bindImport = (reference) => (event) => {
    event.preventDefault();
    const ref = Ux.onReference(reference, 1);
    const {$data = {}} = ref.state;
    if (!Ux.isEmpty($data)) {
        Ux.valueValid($data);       // 去掉undefined
        Ux.rdxSubmitting(reference);    // 开启重复提交
        Ux.dgDebug($data, "初始化应用提交数据：");
        Ux.ajaxPost("/api/app/init/:key", $data)
            .then(updatedApp => Ux.showDialog(reference, "inited", () => {
                // 重写Redux树
                Ux.writeTree(reference, {
                    "app": updatedApp,
                    "status.submitting": {loading: false} // 关闭重复提交
                });
                // 直接进入另外一个界面
                Ux.toRoute(reference, Ux.Env.ENTRY_ADMIN);
            }))
    }
};
export default {
    bindImport,
    /**
     * 检查数据源按钮
     */
    $opConnect,
    /**
     * 保存数据源按钮
     */
    $opNext1: (reference) => Ux.ai2Event(reference, (values) => Ux.rxOp(reference)
        .success(() => _nextPhase(reference, values))
        .to(_nextStep(reference))),
    // 第二页的按钮
    $opNext2: (reference) => Ux.ai2Event(reference, (values) => Ux.rxOp(reference)
        .verify(_verifySource(reference), "verifying")
        .success(() => _nextPhase(reference, values))
        .to(_nextStep2(reference))),
    $opReset2: $opReset,
    ...Init
}