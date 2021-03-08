import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import {Table} from 'antd';
import './Cab.less';
import {Dsl} from 'entity';

/**
 * ## 「组件」`ExHistory`
 *
 * ```js
 * import { ExHistory } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * @memberOf module:web-component
 * @method ExHistory
 **/
// =====================================================
// componentInit/componentUp
// =====================================================

const yoAdjust = (reference) => {
    const {data = {}} = reference.props;
    const changes = Ux.isArray(data.items) ? data.items : [];
    return Dsl.codex(reference).bind().done(changes);
};
const componentInit = (reference) => {
    const state = {};
    const {data} = reference.props;
    if (data) {
        state.$multi = Ux.isArray(data);
        state.$ready = true;
        const table = Ux.fromHoc(reference, "table");
        const $table = Ux.clone(table);
        $table.columns = Ux.configColumn(reference, table.columns);
        $table.pagination = false;
        $table.className = "ex-history";
        state.$table = $table;
        reference.setState(state);
    }
};

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExHistory")
    .to()
)
class Component extends React.PureComponent {

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$multi = false} = this.state;
            if ($multi) {
                return false;
            } else {
                const {$table = {}} = this.state;
                /*
                 * 默认不用 $loading
                 */
                const dataSource = yoAdjust(this);
                return (
                    <Table {...$table} dataSource={dataSource}/>
                )
            }
        }, Ex.parserOfColor("ExHistory").component())
    }
}

export default Component;