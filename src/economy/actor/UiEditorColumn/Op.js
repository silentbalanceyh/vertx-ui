import Ux from 'ux';
import U from 'underscore';
import Fx from '../Fx';

/**
 * 处理列信息
 * @param reference
 * @param $config
 * @returns {{$selected: Array, $options}}
 * @private
 */

const init = (reference) => {
    const {$config = {}} = reference.props;
    let {buttons = []} = $config;
    // 选中行处理，直接从表格列中读取
    const columns = Fx.initColumnWithSelected(reference, $config);
    const {$selected = []} = columns;
    // 按钮专用处理
    const $buttons = Ux.clone(buttons);
    $buttons.forEach(item => {
        // 主要处理事件
        if ("RESET" === item.event) {
            // 重置列事件
            item.onClick = onSelected(reference, $selected);
        } else {
            // 事件触发专用
            item.onClick = Fx.rxSaveColumn(reference);
        }
    });

    reference.setState({$buttons, ...columns});
};

const onSelected = (reference, defaultSelected) => ($selected) => {
    if (U.isArray($selected)) {
        reference.setState({$selected});
    } else {
        if (defaultSelected) {
            reference.setState({$selected: defaultSelected});
        } else {
            reference.setState({$selected});
        }
    }
};

export default {
    onSelected,
    init
};