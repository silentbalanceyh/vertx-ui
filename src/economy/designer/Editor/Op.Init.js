const initPage = (reference) => (page) => {
    page.on('afteritemselected', ev => {
        let model = ev.item.getModel();
        // 拷贝类型用于判断
        model.type = ev.item.type;
        reference.setState({
            selectedModel: model
        });
    });
    page.on('afteritemunselected', ev => {
        reference.setState({
            // 没选中组、线、节点
            selectedModel: {}
        });
    });
    page.on('afterzoom', ev => {
        reference.setState({
            curZoom: ev.updateMatrix[0]
        });
    });
};
export default {
    initPage
};