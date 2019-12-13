import fnPrepare from './O.fn.save.prepare';
import Ux from "ux";
import Ex from "ex";
import {Dsl} from 'entity';

export default (reference, key) => (selected = [], ref = {}) => {
    const processed = fnPrepare(reference, key, selected);
    /*
     * 数据全部准备好
     */
    if ("up" === key) {
        reference.setState({$loadingUp: true, $submitting: true});
    } else {
        reference.setState({$loadingDown: true, $submitting: true});
    }
    Ux.toLoading(() => Ex.I.relationSave(processed).then(data => {
        /*
         * 读取最新的 data 数据信息
         */
        let {$data = {}} = reference.state;
        $data = Ux.clone($data);
        let $dataArray;
        if ("up" === key) {
            $dataArray = Dsl.getArray(Ux.isArray($data.up) ? $data.up : []);
            data.forEach(dataItem => $dataArray.saveElement(dataItem));
            $data.up = $dataArray.to();
        } else {
            $dataArray = Dsl.getArray(Ux.isArray($data.down) ? $data.down : []);
            data.forEach(dataItem => $dataArray.saveElement(dataItem));
            $data.up = $dataArray.to();
        }
        /*
         * 内层钩子函数，用于关闭窗口（必须）
         */
        if (ref.props) {
            Ex.rx(ref).close();
        }
        reference.setState({
            $data, $submitting: false,
            $selectedUp: [], $loadingUp: false,
            $selectedDown: [], $loadingDown: false,
        });
    }));
};