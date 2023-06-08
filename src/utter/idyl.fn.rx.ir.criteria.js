import Ux from 'ux';
import {Dsl} from "entity";

const irViewColumn = ($table = {}, $columnsMy = [], $columns = []) => {
    if (!Ux.isEmpty($table)) {
        /*
         * 本次更新列为 $columnsMy
         * $calculated 为计算的保留列信息，该列在 table 中会用来更新 table.columns 的信息
         */
        const $calculated = [];
        $columnsMy.forEach(field => {
            const column = Ux.elementUnique($columns, 'dataIndex', field);
            if (column) {
                $calculated.push(column);
            }
        })
        $table = Ux.clone($table);
        $table.columns = $calculated;
        return $table;
    } else {
        throw new Error("表格配置出错，请重新检查！！！")
    }
}
/**
 * ## 「扩展」`Ex.irViewV`
 * @memberOf module:qr/utter
 * @param reference
 * @returns {*}
 */
const irViewV = (reference) => ($columnsMy = [], addOn = {}) => {
    $columnsMy = Ux.clone($columnsMy);
    if (!$columnsMy.includes('key')) {
        $columnsMy = ['key'].concat($columnsMy);
    }
    /*
     * 处理 state 中的 table 部分
     */
    let {$table = {}, $columns = []} = reference.state;
    /*
     * 表格 table 中的内容
     */
    const state = {
        $columnsMy,// 修改 $columnsMy 变量（我的视图信息更新）
        $table: irViewColumn($table, $columnsMy, $columns)
    };
    if (!Ux.isEmpty(addOn)) {
        Object.assign(state, addOn);
    }
    /*
     * {
     *      $columnsMy：我的视图会被更新
     *      table: 主要更新 columns
     *      $dirty: true（触发重新加载）
     * }
     */
    // reference.?etState(state);
    Ux.of(reference).in(state).handle(() => {
        Ux.dglVColumn(reference);
    });
    // reference.?etState(state);
};
/**
 * ## 「扩展」`Ex.irViewAt`
 * @memberOf module:qr/utter
 * @param reference
 * @returns {*}
 */
const irViewAt = (reference) => (params = {}) => {
    /*
     * 需要更新的点：
     * 1. state -> $queryView 需要更新 criteria, projection
     * 2. state -> $table / $columnsMy 需要更新成 projection
     * 3. state -> $qr 需要更新成 criteria
     * 4. state -> $myView 需要更新 name, title
     * 5. 重新加载
     */
    const state = {};
    {
        const $myView = {};
        $myView.name = params.name;
        $myView.title = params.title;
        state.$myView = $myView;
    }
    {
        const {projection} = params;
        let {$table = {}, $columns = []} = reference.state;
        /* 计算 projection */
        let $projection = [];
        if (Ux.isArray(projection)) {
            $projection = projection;
        } else {
            $projection = $columns.map(column => column.dataIndex);
        }
        Object.assign(state, {
            $columnsMy: $projection,// 修改 $columnsMy 变量（我的视图信息更新）
            $table: irViewColumn($table, $projection, $columns)
        });
    }
    const {$queryView = {}} = reference.state;
    const queryRef = Dsl.getQuery($queryView, reference);
    queryRef.and(params.criteria);
    state.$query = queryRef.to();
    Ux.of(reference).in(state).spinning().loading().handle(() => {
        Ux.dglViewAt(reference);
    });
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    irViewAt,
    // #QR-COMMENT
    /**
     * ## 「扩展」`Ex.irViewQ`
     *
     * @memberOf module:qr/utter
     * @param reference
     * @returns {*}
     */
    irViewQ: (reference) => (params) => {
        // #QR-COMMENT
        const [state, queryRef] = Ux.irData(reference)(params);
        state.$query = queryRef.to();
        /*
         * 此处做个详细说明，计算的 state 的数据结构为：
         * - $condition
         * - $keyword
         * - $qr
         * - $query
         * 此处计算的 $qr 中是包含了 connector 变量的，即 $qr 中一直都包含 $connector 变量
         * 所以计算 connector 时如果不包含 connector 变量则视为 AND，否则维持不变
         */
        return Ux.of(reference).in(state).spinning().loading().future(() => {
            Ux.dglQrC(reference, false);
            return Ux.promise();
        });
    },
    // irSubmit: (reference) => Ux.irSubmit(reference),
    irViewV,       // Projection
}