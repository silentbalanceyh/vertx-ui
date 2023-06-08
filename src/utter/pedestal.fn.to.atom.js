import Ux from 'ux';

const toNamespace = (reference) => {
    if ("string" === typeof reference) {
        return `cn.originx.${reference}`;
    } else {
        const {$app} = reference.props;
        if ($app && $app.is()) {
            const name = $app._('name');
            if (name && "string" === typeof name) {
                return toNamespace(name);
            } else {
                console.error("[ Ex ] 应用数据有问题！", $app.to());
            }
        } else {
            console.error("[ Ex ] 未捕捉到应用信息！", reference.props);
        }
    }
};
const toModelId = (reference, field) => {
    const inited = Ux.ambObject(reference, Ux.Env.K_NAME.INITED);
    const module = Ux.fromHoc(reference, "module");
    if (module[field]) {
        const config = module[field];
        return toIdentifier(config, inited['modelId']);
    }
};
const toIdentifier = (config = {}, program) => {
    if (Ux.isEmpty(config)) {
        throw new Error(" config 在解析 modelId 的时候不可为空，请检查！")
    } else {
        const defaultValue = config.__DEFAULT__ ? config.__DEFAULT__ : Ux.Env.CV_DELETE;
        const identifier = program ? program : defaultValue;
        if (config.hasOwnProperty(Ux.Env.K_UI.PATTERN)) {
            const expr = config[Ux.Env.K_UI.PATTERN];
            return Ux.formatExpr(expr, {identifier});
        } else {
            return config[identifier];
        }
    }
};
export default {
    toNamespace,
    toModelId,
    toIdentifier,
}