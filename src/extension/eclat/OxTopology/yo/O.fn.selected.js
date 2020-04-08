import Ux from 'ux';

export default (reference) => (key) => {
    reference.setState({$ready: false});
    Ux.ajaxGet("/api/graphic/:key", {key}).then(response => {
        const state = {};
        state.$tplKey = key;
        const {$tplData = {}} = reference.state;
        const dataNodes = $tplData.nodes;
        const {nodes = [], edges = []} = response;

        nodes.forEach(node => {
            const category = node.id;
            const counter = dataNodes
                .filter(node => !!node)
                .map(node => node.data)
                .filter(each => !!each)
                .filter(item => {
                    if (category === item.categoryThird) {
                        return true;
                    } else {
                        return category === item.categorySecond;
                    }
                }).length;
            node._counter = `（${counter}）`;
            node.shape = "exBaseNode";  /* 改成基础图形 */
        });
        state.$data = {graphic: {nodes, edges}};
        state.$ready = true;
        reference.setState(state);
    });
}