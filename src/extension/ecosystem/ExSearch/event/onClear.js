import Ex from 'ex';
import {Modal} from 'antd';

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
        return Ex.promise(true);
    }
};

export default (reference) => (event) => {
    Ex.prevent(event);
    /*
     * 提示信息处理，清除操作
     */
    return _nextConfirm(reference)
    /*
     * 确认后的操作
     */
        .then(Ex.cbTrue(() => {
            /*
             * 清除专用操作
             * reference 为当前引用
             */
            reference.setState({
                searchText: ""
            });
            Ex.rx(reference).filter();
        }))
    // onSearch(reference)("");    // onSearch 处理事件
    // reference.setState({searchText: ""});
}