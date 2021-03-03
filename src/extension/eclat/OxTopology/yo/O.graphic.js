import Ux from 'ux';
import Ui from '../component';

export default {
    onTpl: (reference) => (gRequest, gEvent) => {
        const {$tpl = []} = reference.state;
        if (0 < $tpl.length) {
            const options = [];
            $tpl.forEach(tpl => {
                const tplOption = {};
                tplOption.key = tpl.key;
                tplOption.value = tpl.key;
                tplOption.name = tpl.name;
                options.push(tplOption);
            });
            // 打开窗口
            gEvent.winOpen(options, {
                $openKey: 'WIN_TPL',
                $openId: 'cmdTpl',
                $openComponent: Ui.TplComponent,
            });
        } else {
            Ux.sexDialog(reference, 'no-tpl');
        }
    },
    /*
     * 构造节点数据
     */
    onGraphInit: (reference) => (gEvent) => {
        const data = {
            nodes: [],
            edges: []
        };
        const {$data = {}} = reference.state;
        const {nodes = [], edges = []} = $data;
        nodes.map(node => {
            const nodeData = node.data;
            if (nodeData) {
                const processed = Ux.clone(nodeData);
                const cat = Ux.elementUniqueDatum(reference, 'data.category', 'key', nodeData.categoryThird);
                if (cat) {
                    processed.identifier = cat.identifier;
                }
                if (node.attrs) {
                    processed.attrs = node.attrs;
                }
                return processed;
            } else return null;
        }).filter(item => !!item).map(node => gEvent.nodeCreate(node)).forEach(node => data.nodes.push(node));
        edges.map(edge => gEvent.edgeCreate(edge)).forEach(edge => data.edges.push(edge));
        {
            const {$inited} = reference.props;
            gEvent.layoutOn(data, {
                focusNode: $inited.globalId,
            })
        }
        return Ux.promise(data);
    },
    /*
     * 查看 CI 信息
     */
    onNodeDoubleClick: (reference) => (cell, gEvent) => {
        const {$inited = {}, onNodeDoubleClick} = reference.props;
        const data = cell.getData();
        if ($inited.globalId !== data.globalId) {
            if (Ux.isFunction(onNodeDoubleClick)) {
                onNodeDoubleClick(data);
            } else {
                // 打开窗口
                gEvent.winOpen(data, {
                    $openKey: 'WIN_CI',
                    $openId: data.key,
                    $openComponent: Ui.CiComponent,
                });
            }
        } else {
            Ux.sexMessage(reference, 'same');
        }
    }
}