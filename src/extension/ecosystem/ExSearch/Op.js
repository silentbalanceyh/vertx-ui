import Ex from 'ex';
import Ux from "ux";

import {Modal} from "antd";

const _nextConfirm = (reference) => {
    const {config = {}} = reference.props;
    const content = config[Ex.Opt.SEARCH_CONFIRM_CLEAR];
    if (content) {
        return new Promise((resolve) => {
            Modal.confirm({
                content,
                onOk: () => resolve(true)
            })
        })
    } else {
        return Ux.promise(true);
    }
};

const Event = {
    onSearch: (reference) => (searchText) => {
        const {config = {}} = reference.props;
        const cond = config[Ex.Opt.SEARCH_COND];
        if (Ux.isArray(cond)) {

            /*
             * 构造新的查询条件
             */
            let $filters = {};
            if (searchText) {
                $filters = Ux.qrInput(cond, searchText);
            }
            /*
             * 基础搜索
             */
            Ex.rx(reference).filter($filters);
        }
    },
    onChange: (reference) => (event) => {
        Ux.prevent(event);
        const searchText = event.target.value;
        reference.setState({searchText});
    },
    onClear: (reference) => (event) => {
        Ux.prevent(event);
        /*
         * 提示信息处理，清除操作
         */
        return _nextConfirm(reference)
            /*
             * 确认后的操作
             */
            .then(Ux.ajax2True(() => {
                /*
                 * 清除专用操作
                 * reference 为当前引用
                 */
                reference.setState({
                    searchText: ""
                });
                /*
                 * 清除两个变量
                 * 1）$filters（条件）
                 * 2）$filtersRaw（表单）
                 */
                Ex.rx(reference).filter({}, {});
            }))
        // onSearch(reference)("");    // onSearch 处理事件
        // reference.setState({searchText: ""});
    }
}

const isSearch = (reference) => {
    const {config = {}} = reference.props;
    const {$search} = reference.state;
    return !!config[Ex.Opt.SEARCH_ENABLED] && !!$search;
};
const isAdvanced = (reference) => {
    const {config = {}} = reference.props;
    const {$advanced} = reference.state;
    return !!config[Ex.Opt.SEARCH_ADVANCED] && !!$advanced;
};
export default {
    isSearch,
    isAdvanced,
    // 穿透
    ...Event,
}