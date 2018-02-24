import Log from './Ux.Log';
import Dialog from './Ux.Dialog';
import Dg from './Ux.Debug';
import State from './Ux.State';
import Immutable from 'immutable';
import Params from './Ux.Param';
import U from 'underscore'

const onSubmit = (execFun, effectKey) => (reference) => (event) => {
    Dg.ensureAttr("onSubmit", effectKey);
    event.preventDefault();
    const {form} = reference.props;
    const refresh = {};
    refresh[effectKey] = true;
    reference.setState(refresh);
    form.validateFieldsAndScroll((error, values) => {
        if (error) {
            refresh[effectKey] = false;
            reference.setState(refresh);
            return;
        }
        const promise = execFun(values, reference);
        if (promise) {
            promise.catch(error => {
                Log.error(error);
                refresh[effectKey] = false;
                reference.setState(refresh);
                if (error.info) {
                    Dialog.showError(reference, error.info);
                }
            })
        }
    })
};

const onShow = (execFun, effectKey) => (reference) => (event) => {
    Dg.ensureAttr("onShow", effectKey);
    const state = {};
    state[effectKey] = true;
    reference.setState(state);
    if (execFun) {
        execFun(event);
    }
};

const onHide = (execFun, effectKey) => (reference) => (event) => {
    Dg.ensureAttr("onHide", effectKey);
    const state = {};
    state[effectKey] = false;
    reference.setState(state);
    if (execFun) {
        execFun(event);
    }
};

const onSearch = (reference) => (event) => {
    event.preventDefault();
    const {form} = reference.props;
    let values = {};
    if (form) {
        values = form.getFieldsValue();
    }
    State.writeTree(reference, {
        "query.filters" : values,
        "datum.data" : undefined
    });
};

const onResetFilter = (reference) => (event) => {
    event.preventDefault();
    const {form} = reference.props;
    if (form) {
        form.resetFields();
    }
    State.writeTree(reference, {
        "query.filters" : {},
        "datum.data" : undefined
    });
};
const cycleUpdatePageList = (reference = {}, key = 'list', prevProps = {}) => {
    const data = reference.props[`$${key}`];
    if (!data) {
        const {fnData} = reference.props;
        if (fnData) {
            // 查询条件规范化
            const query = Params.parseQuery(reference);

            fnData(query);
        }
    }
};
const cycleDestoryForm = (props = {}, prevProps = {}) => {
    // Destory
    const $destory = props.$destory;
    const $prevDestory = prevProps.$destory;
    if ($destory !== $prevDestory && $destory) {
        const {form} = props;
        if (form) {
            form.resetFields();
        }
    }
    const $router = props.$router;
    const $prevRouter = prevProps.$router;
    if ($router && $prevRouter) {
        if ($router.path() !== $prevRouter.path()) {
            // 重设Form，Reset当前表单
            const {form} = props;
            if (form) {
                form.resetFields();
            }
        }
    }
};
const cycleUpdateForm = (props = {}, prevProps = {}) => {
    const {fnInit} = props;
    if (fnInit) {
        const $key = props.$key;
        const $prevKey = prevProps.$key;
        if ($key !== $prevKey && $key) {
            fnInit({id : $key});
        }
        // Destory
        cycleDestoryForm(props, prevProps);
    } else {
        console.warn("[ Cycle ] System does not detect 'fnInit' function.", fnInit);
    }
};
const onAdvanced = (reference = {}) => (pagination, filters, sorter) => {
    const {$query, fnData, fnOut} = reference.props;
    if (fnData && fnOut) {
        // 分页参数
        $query.pager.page = pagination.current;
        $query.pager.size = pagination.pageSize;
        const keys = Object.keys(sorter);
        // 排序参数
        if (0 < keys.length) {
            let sorting = sorter.field;
            sorting += "," + ("descend" === sorter.order ? "ASC" : "DESC");
            $query.sorter = [sorting];
        } else {
            delete $query.sorter;
        }
        // 查询条件规范化
        const query = Params.parseQuery(reference, $query);
        fnData(query);
    }
};
const connectButton = (dialog = {}) => {
    if ("string" === typeof dialog.onOk) {
        // 防止引用切换，必须使用Immutable
        const key = Immutable.fromJS(dialog).toJS();
        dialog.onOk = () => {
            const ele = document.getElementById(key.onOk);
            if (ele) {
                ele.click();
            }
        }
    } else {
        // 防重复注入
        if (!U.isFunction(dialog.onOk)) {
            console.warn("[ Cycle ] Connect key onOk = \"" + dialog.onOk + "\" is missing.");
        }
    }
};
const connectTopbar = (topbar = {}, key) => {
    if (key && topbar.buttons && Array.prototype.isPrototypeOf(topbar.buttons[key])) {
        const buttons = Immutable.fromJS(topbar.buttons[key]).toJS();
        buttons.forEach(button => {
            // 防重复注入
            if (!U.isFunction(button.onClick)) {
                button.onClick = () => {
                    const ele = document.getElementById(button.key);
                    if (ele) {
                        ele.click();
                    }
                }
            }
        });
        topbar.buttons[key] = buttons;
    } else {
        console.warn("[ Cycle ] Connect topbar.buttons is invalid.");
    }
};
export default {
    onSubmit,
    onShow,
    onHide,
    onResetFilter,
    onSearch,
    onAdvanced,
    // 更新
    cycleUpdatePageList,
    cycleUpdateForm,
    cycleDestoryForm,
    // 连接
    connectButton,
    connectTopbar
}
