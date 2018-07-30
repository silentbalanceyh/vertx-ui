import {v4} from 'uuid';
import Ux from 'ux';
import Init from './Op.Init';
import Immutable from 'immutable';

const addTab = (reference) => {
    const {tabs = {}} = reference.state;
    const type = tabs.items.filter(item => "ADD" === item.type);
    if (0 < type.length) {
        tabs.activeKey = type[0].key;
    } else {
        const config = Init.initConfig(reference);
        const tab = {};
        tab.key = v4();
        tab.tab = config.tabs.add;
        tab.type = "ADD";
        tab.index = tabs.items.length;
        tabs.items.push(tab);
        tabs.activeKey = tab.key;
    }
    const updated = Immutable.fromJS(tabs).toJS();
    reference.setState({tabs: updated});
};

const editTab = (reference, id, params) => {
    const {tabs = {}} = reference.state;
    const found = tabs.items.filter(item => item.key === id);
    if (0 < found.length) {
        tabs.activeKey = found[0].key;
    } else {
        const config = Init.initConfig(reference);
        const tab = {};
        tab.key = id;
        tab.tab = Ux.formatExpr(config.tabs.edit, params);
        tab.type = "EDIT";
        tab.index = tabs.items.length;
        tabs.items.push(tab);
        tabs.activeKey = tab.key;
    }
    const updated = Immutable.fromJS(tabs).toJS();
    reference.setState({tabs: updated});
};
const rxAdd = (reference) => (event) => {
    event.preventDefault();
    switchView(reference, "add");
    addTab(reference);
};

const rxAjax = (reference, options = {}, params) => {
    let fnAjax = null;
    if (!options.method) options.method = "GET";
    switch (options.method) {
        case "GET":
            fnAjax = Ux.ajaxGet(options.uri, params);
            break;
        case "DELETE":
            fnAjax = Ux.ajaxDelete(options.uri, params);
            break;
        case "POST":
            fnAjax = Ux.ajaxPost(options.uri, params);
            break;
        default:
            break;
    }
    return fnAjax;
};

const rxEdit = (reference, id) => {
    const {$self} = reference.props;
    const config = Init.initConfig($self);
    if (config.ajax) {
        const options = config.ajax.get;
        const promise = rxAjax($self, options, {id});
        if (promise) {
            promise.then(data => {
                let {record = {}} = $self.state;
                record[id] = data;
                record = Immutable.fromJS(record).toJS();
                $self.setState({record});
                editTab($self, id, data);
                switchView($self, "edit", id);
            })
        }
    }
};

const rxDelete = (reference, id) => {
    const {$self} = reference.props;
    switchView($self, "list", id)
};
const switchView = (reference, view, key) => {
    if (reference) {
        view = view ? view : "list";
        reference.setState({view, key})
    }
};
const activeDrawer = (reference) => (event) => {
    event.preventDefault();
    reference.setState({drawer: true})
};
const closeDrawer = (reference) => (event) => {
    event.preventDefault();
    reference.setState({drawer: false})
};
const activeTab = (reference) => (key) => {
    let {tabs = {}} = reference.state;
    tabs.activeKey = key;
    tabs = Immutable.fromJS(tabs).toJS();
    // 计算右边按钮
    const item = tabs.items.filter(item => item.key === key)[0];
    if ("ADD" === item.type) {
        switchView(reference, "add");
    } else if ("EDIT" === item.type) {
        switchView(reference, "edit", key);
    } else {
        switchView(reference, "list");
    }
    reference.setState({tabs});
};
const closeTab = (reference) => (key, action) => {
    let {tabs = {}} = reference.state;
    if ("remove" === action) {
        let item = tabs.items.filter(item => key === item.key);
        if (item) {
            item = item[0];
            const index = item.index - 1;
            if (2 < tabs.items.length) {
                const activeItem = tabs.items.filter(item => item.index === index)[0];
                tabs.activeKey = activeItem.key;
                tabs.items = tabs.items.filter(item => key !== item.key);
                if (0 === activeItem.index) {
                    switchView(reference, "list");
                } else {
                    switchView(reference, "edit", activeItem.key);
                }
            } else {
                tabs.activeKey = tabs.items[0].key;
                tabs.items = [tabs.items[0]];
                switchView(reference, "list");
            }
        }
    }
    tabs = Immutable.fromJS(tabs).toJS();
    reference.setState({tabs});
};
export default {
    rxAdd,
    rxEdit,
    rxDelete,
    activeDrawer,
    closeDrawer,
    activeTab,
    closeTab
}