import Ux from 'ux';
import Ex from 'ex';
/* 必须走内部 */

const toCriteria = (reference) => {
    const {$inited = {}} = reference.props;
    const user = Ux.isLogged();
    const category3 = Ux.elementUniqueDatum(reference, "data.category", "key", $inited.categoryThird);
    const category2 = Ux.elementUniqueDatum(reference, "data.category", "key", $inited.categorySecond);
    const criteria = {
        "": true,
        "$0": {
            ownerId: user.key,
            "": false,
            "ownerId,n": true
        }
    };
    if (category2 && category3) {
        criteria['modelId,i'] = [
            category2.identifier,
            category3.identifier,
        ]
    }
    return criteria;
};

const toDialog = (reference) => {
    const {config = {}} = reference.props;
    const {$dialog} = config;
    if ($dialog) {
        const dialog = Ux.configDialog(reference, $dialog.window);
        const button = $dialog.button;
        return {dialog, button};
    }
}
/*
 * 先 level = 2 的方式读取
 * - 如果数据量超过 60，则再读取一次 level = 1
 * - 如果数据量不超过 60，则以本次结果为主
 */

const toData = (processed = {}, key) => {
    return Ux.ajaxGet("/api/graphic/analyze/:key?level=2", {key}).then(response => {
        const {nodes = []} = response;
        if (60 < nodes.length) {
            /*
             * 这里的理论值一定不会超过 60 个节点，超过 60 个节点就需要检查当前环境中的关系设置了。
             */
            return Ux.ajaxGet("/api/graphic/analyze/:key?level=1", {key});
        } else return Ux.promise(response);
    })
}

export default (reference) => {
    const state = {};
    Ex.yiStandard(reference, state).then(processed => {
        const {$inited = {}} = reference.props;
        const key = $inited.globalId;

        /* 窗口专用配置 */
        const $dialog = toDialog(reference);
        if ($dialog) {
            processed.$dialog = $dialog;
        }

        /* 读取节点信息 */
        return toData(processed, key).then(response => {
            /* 当前节点高亮 */
            const {nodes = []} = response;
            nodes.forEach(node => {
                if (key === node.key) {
                    node.data.contentStyle = {
                        fill: "#FFEC8B"
                    }
                }
            });
            /* 还超过60个的情况，置空，无法绘制 */
            if (60 < nodes.length) {
                processed.$data = {nodes: [], edges: []};
            }
            /*
            * 拓扑图数据信息
            * $tplData - 原始数据信息（包含了当前节点对应的所有数据）
            * $data - 运行时可改变的数据信息
            * */
            processed.$tplData = response;
            processed.$data = response;
            return Ux.promise(processed);
        }).then(processed => Ux.ajaxPost('/api/graphic/search', {
            criteria: toCriteria(reference)
        }).then((definition = {}) => {
            /* 图模板相关信息 */
            const {list = []} = definition;
            const $tpl = Ux.clone(list);
            $tpl.filter(item => !item.value).forEach(item => item.value = item.key);
            processed.$tpl = $tpl;
            /* 核心模板数据信息 */
            // processed.$tplData = processed.$data;
            return Ux.promise(processed);
        })).then(Ux.ready).then(Ux.pipe(reference));
    })
}