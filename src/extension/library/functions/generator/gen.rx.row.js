import G from "../global";
import Ux from "ux";
import U from 'underscore';

const rxDelete = (reference) => (key, callback) => {
    if (key) {
        const {options = {}, $selected = []} = reference.state;
        const uri = options[G.Opt.AJAX_DELETE_URI];
        return Ux.ajaxDelete(uri, {key})
            .then(() => {
                    const num = $selected.indexOf(key);
                    //删除后从选中项中清除
                    if (-1 !== num) {
                        $selected.splice(num, 1);
                    }
                    //修改状态
                    if (0 === $selected.length) {
                        reference.setState({$selected: []});
                    } else {
                        reference.setState({$selected});
                    }
                    // 删除后续方法
                    const {rxPostDelete} = reference.props;
                    if (U.isFunction(rxPostDelete)) {
                        rxPostDelete({key});
                    }
                    callback(key);
                }
            )
            .catch(error => {
                console.error(error);
                reference.setState({$dirtyAsync: false});
            })
    }
};
const rxView = (reference) => (key) => {
    if (key) {
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_GET_URI];
        return Ux.ajaxGet(uri, {key});
    }
};
const rxSelected = (reference) => ($selected = [], $data = []) => {
    reference.setState({$selected});
    const {rxPostSelected} = reference.props;
    if (Ux.isFunction(rxPostSelected)) {
        rxPostSelected($data);
    }
};
export default {
    rxDelete,
    rxSelected,
    rxView,
}