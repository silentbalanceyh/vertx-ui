import Ux from 'ux';

export default (reference) => (key) => {
    reference.setState({$ready: false, $tplKey: key});
    Ux.ajaxGet('/api/graphic/:key', {key}).then(response => {
        /* 读取原始数据 */
        const {$tplData = {}} = reference.state;

        /* 直接根据类型过节点 */
        const keys = response.nodes ? response.nodes
            .map(node => node.id).filter(item => !!item) : [];
        const $keys = Ux.immutable(keys);

        /* 直接过滤 nodes */
        let $nodes = $tplData.nodes;
        $nodes = $nodes.filter(item => {
            if (item.data) {
                const {categoryThird, categorySecond} = item.data;
                return (
                    $keys.contains(categoryThird) ||
                    $keys.contains(categorySecond)
                );
            } else {
                // 不渲染无数据节点
                return false;
            }
        });

        /* 新图新数据 */
        const $data = Ux.clone($tplData);
        $data.nodes = $nodes;
        reference.setState({$ready: true, $data});
    })
}