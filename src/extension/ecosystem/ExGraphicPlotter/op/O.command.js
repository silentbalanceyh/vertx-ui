import Ux from 'ux';

const executeAction = (gEvent, graph, name) => {
    const reference = gEvent.reference();
    reference.setState({$submitting: true});
    /*
     *  节点 nodes 和 边 edges
     */
    const graphData = gEvent.dataGraph();
    const {$action = {}} = reference.props;
    const executor = $action[name];
    if (Ux.isFunction(executor)) {
        const doSubmit = () => reference.setState({$submitting: false});
        return executor(graphData, doSubmit, graph)
    } else {
        throw new Error("缺失 rxSubmit 专用提交函数！");
    }
};

export default {
    save: (gEvent) => (graph) => executeAction(gEvent, graph, 'save')
}