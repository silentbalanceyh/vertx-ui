import UI from './Fn.UI'

const _extract = (array, vectors = []) => {
    if (array) {
        array.forEach(item => {
            const vector = {};
            let from, to;
            if ("string" === typeof item) {
                const splitted = item.split(',');
                if (splitted[1]) {
                    from = `${splitted[1]}（${splitted[0]}）`;
                } else {
                    from = splitted[0];
                }
                to = splitted[2];
            } else {
                if (item.text) {
                    from = `${item.text}（${item.id || item.key}）`
                } else {
                    from = item.id || item.key;
                }
                to = item.connectId;
            }
            vector.name = from;
            vector.color = "#036";
            // 计算儿子
            const children = {};
            children.name = to;
            children.color = "#Fc3";
            vector.children = [children];
            vectors.push(vector);
        })
    }
};

const _connectPage = (config = {}, file) => {
    const content = config.content['_page'];
    // 不递归，只计算三级
    const vector = {};
    vector.name = file;
    vector.color = "#903";
    if (content) {
        let items = [];
        // left专用
        _extract(content.left, items);
        // right专用
        _extract(content.right, items);
        vector.children = items;
    }
    const metadata = {};
    // 如果只有一级连接则宽度180，二级连接则宽度120
    metadata.layout = {
        hgap: 180,
        vgap: 10,
        height: 60 * vector.children.length
    };
    metadata.items = vector;
    return metadata;
};

const connectPage = (reference, file = "UI.Demo") => {
    const config = UI.connect(reference, file);
    const title = config.header;
    // 判断类型
    if (config.content.hasOwnProperty("_grid")) {
        // ComplexList、DialogList专用
        return {title};
    } else if (config.content.hasOwnProperty("_page")) {
        // PageCard、HelpCard专用
        return {title, ..._connectPage(config, file)};
    }
};
export default {
    connectPage
}