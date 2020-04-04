import Ux from 'ux';
import Ex from 'ex';

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

export default (reference) => {
    const state = {};
    Ex.yiStandard(reference, state).then(processed => {
        const {$inited = {}} = reference.props;
        const key = $inited.globalId;

        Ux.ajaxGet("/api/graphic/analyze/:key?level=2", {key}).then(response => {
            /* 是否过多 */
            const {nodes = []} = response;
            nodes.forEach(node => {
                if (key === node.key) {
                    node.data.contentStyle = {
                        fill: "#FFEC8B"
                    }
                }
            });
            if (60 < nodes.length) {
                /* 过多上部呈现下拉处理 */
                return Ux.ajaxPost('/api/graphic/search', {
                    criteria: toCriteria(reference)
                }).then(definition => {
                    processed.$ready = true;
                    processed.$data = {nodes: [], edges: []};
                    /*
                     * $tpl（模板模式处理）
                     */
                    const {list = []} = definition;
                    const $tpl = [];
                    list.forEach(item => {
                        const option = {};
                        option.key = item.key;
                        option.name = item.name;
                        option.value = item.key;
                        $tpl.push(option);
                    });
                    processed.$tpl = $tpl;
                    processed.$tplKey = "ALL";
                    processed.$tplData = response;
                    reference.setState(processed);
                })
            } else {
                processed.$ready = true;
                processed.$data = response;
                processed.$tplData = response;
                processed.$tpl = undefined;
                reference.setState(processed);
            }
        });
    })
}