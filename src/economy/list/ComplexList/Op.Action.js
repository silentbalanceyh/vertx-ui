import {v4} from 'uuid';
import Ux from 'ux';
import Init from './Op.Init';
import Immutable from 'immutable';

const stateAddTab = (reference) => {
    let {tabs = {}} = reference.state;
    tabs = Immutable.fromJS(tabs).toJS();
    const type = tabs.items.filter(item => "add" === item.type);
    if (0 < type.length) {
        tabs.activeKey = type[0].key;
    } else {
        const options = Init.readOption(reference);
        const tab = {};
        tab.key = v4();
        tab.tab = options['tabs.add'];
        tab.type = "add";
        tab.index = tabs.items.length;
        tabs.items.push(tab);
        tabs.activeKey = tab.key;
    }
    return tabs;
};

const stateEditTab = (reference, id, params) => {
    let {tabs = {}} = reference.state;
    tabs = Immutable.fromJS(tabs).toJS();
    const found = tabs.items.filter(item => item.key === id);
    if (0 < found.length) {
        tabs.activeKey = found[0].key;
    } else {
        const options = Init.readOption(reference);
        const tab = {};
        tab.key = id;
        tab.tab = Ux.formatExpr(options['tabs.edit'], params);
        tab.type = "edit";
        tab.index = tabs.items.length;
        tabs.items.push(tab);
        tabs.activeKey = tab.key;
    }
    return tabs;
};
const rxAdd = (reference) => (event) => {
    event.preventDefault();
    const view = Init.stateView("add");
    const tabs = stateAddTab(reference);
    reference.setState({tabs, ...view});
};

const rxEdit = (reference, id) => {
    const {$self} = reference.props;
    const options = Init.readOption($self);
    const uri = options['ajax.get.uri'];
    const promise = Ux.ajaxGet(uri, {id});
    promise.then(data => {
        let {record = {}} = $self.state;
        record[id] = data;
        record = Immutable.fromJS(record).toJS();
        $self.setState({record});
        const tabs = stateEditTab($self, id, data);
        const view = Init.stateView("edit", id);
        $self.setState({tabs, ...view});
    })
};

const rxDeleteDetail = (reference, id) => {
    const options = Init.readOption(reference);
    const uri = options['ajax.delete.uri'];
    const promise = Ux.ajaxDelete(uri, {id});
    promise.then(data => {
        // 删除record数据
        let {record = {}} = reference.state;
        record = Immutable.fromJS(record).toJS();
        if (record[id]) delete record[id];
        // 计算tabs页
        let {tabs = {}} = reference.state;
        tabs = Immutable.fromJS(tabs).toJS();
        tabs.items = tabs.items.filter(item => id !== item.key);
        tabs.activeKey = tabs.items[0].key;
        const view = Init.stateView("list");
        reference.setState({tabs, ...view, record});
        Ux.writeTree(reference, {
            "grid.list": undefined
        });
    });
};

const rxDelete = (reference, id) => {
    const {$self} = reference.props;
    rxDeleteDetail($self, id)
};

const rxClose = (reference, item) => () => {
    // 关闭时处理tab页
    let {tabs = {}} = reference.state;
    tabs = Immutable.fromJS(tabs).toJS();
    tabs.items = tabs.items.filter(each => each.key !== item.key);
    tabs.activeKey = tabs.items[0].key;
    // 计算view
    const view = Init.stateView("list");
    reference.setState({tabs, ...view});
    // 写状态树，重新加载List
    Ux.writeTree(reference, {"grid.list": undefined})
};
const rxFilter = (reference = {}) => (value, event) => {
    const {$query} = reference.props;
    const options = Init.readOption(reference);
    const search = options['search.cond'];
    const filters = {};
    search.forEach(term => filters[term] = value);
    const query = $query.to();
    Object.assign(query.criteria, filters);
    Ux.writeTree(reference, {
        "grid.query": query,
        "grid.list": undefined
    })
};
const rxClear = (reference = {}) => () => {
    const {term} = reference.state;
    if (term) {
        const {$query} = reference.props;
        const query = $query.to();
        const options = Init.readOption(reference);
        const search = options['search.cond'];
        search.forEach(term => delete query.criteria[term]);
        reference.setState({term: ""});
        Ux.writeTree(reference, {
            "grid.query": query,
            "grid.list": undefined
        })
    }
};
const rxInput = (reference = {}) => (event) => {
    const term = event.target.value;
    reference.setState({term})
};
export default {
    rxAdd,
    rxEdit,
    rxDelete,
    rxDeleteDetail,
    rxClose,
    rxFilter,
    rxClear,
    rxInput
}