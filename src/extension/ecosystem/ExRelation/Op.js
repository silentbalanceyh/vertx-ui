import Ux from 'ux';
import U from 'underscore';

const yiPage = (reference) => {
    const {config = {}} = reference.props;
    const state = {};
    const $config = Ux.clone(config);
    const header = Ux.fromHoc(reference, "header");
    if (header) {
        $config.header = Ux.clone(header);
    }
    /*
     * 设置函数用于处理数据
     */
    state.$config = $config;
    state.$ready = true;
    reference.setState(state);
};
/*
 * 分组处理数据信息
 */
const yoTabs = (reference) => {
    const {$config = {}} = reference.state;
    const {data = {}, current, $path = {}} = reference.props;
    const {up = [], down = []} = data;
    if (!Ux.isEmpty($path)) {
        let groupedData = {};
        if (U.isArray($config['relation'])) {
            const $relations = Ux.immutable($config['relation']);
            if ($relations.contains("UP")) {
                const grouped = Ux.elementGroup(up.filter(item => current.identifier === item['targetIdentifier']), "sourceIdentifier");
                Object.keys(grouped).forEach(key => {
                    if (!groupedData[key]) {
                        groupedData[key] = [];
                    }
                    grouped[key].map(each => {
                        if (!each.key) {
                            each.key = each['sourceIdentifier'] + "," + each['targetIdentifier'];
                        }
                        return each;
                    }).forEach(each => groupedData[key].push(each));
                })
            }
            if ($relations.contains("DOWN")) {
                const grouped = Ux.elementGroup(down.filter(item => current.identifier === item['sourceIdentifier']), "targetIdentifier");
                Object.keys(grouped).forEach(key => {
                    if (!groupedData[key]) {
                        groupedData[key] = [];
                    }
                    grouped[key].map(each => {
                        if (!each.key) {
                            each.key = each['sourceIdentifier'] + "," + each['targetIdentifier'];
                        }
                        return each;
                    }).forEach(each => groupedData[key].push(each));
                })
            }
        }
        const tabs = {items: []};
        Object.keys(groupedData).sort(Ux.sorterAsc).forEach(identifier => {
            const data = groupedData[identifier];
            if (0 < data.length) {
                const tab = {};
                tab.key = identifier;
                tab.tab = $path[identifier];
                tab.data = groupedData[identifier];
                tabs.items.push(tab);
            }
        });
        /*
         * 激活专用
         */
        if (0 < tabs.items.length) {
            tabs.defaultActiveKey = tabs.items[0].key;
        }
        tabs.tabPosition = "right";
        tabs.className = "ex-relation-tab";
        return tabs;
    }
};
export default {
    yiPage,
    yoTabs,
}