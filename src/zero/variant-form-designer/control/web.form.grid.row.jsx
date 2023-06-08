import React from "react";

import {LoadingContent, uca} from 'zi';
import __Zn from '../zero.uca.dependency';

const yiInternal = (reference) => {
    const state = {};
    __Zn.raftForm(reference, {
        id: "SubForm-Row-Setting",
        renders: {
            type: (reference, jsx) => {
                return __Zn.aiRadio(reference, jsx, item => {
                    const value = __Zn.ambEvent(item);
                    if ("WEB" !== value) {
                        __Zn.formHit(reference, "columns", "1");
                    }
                })
            },
            columns: (reference, jsx) => {
                const {config = {}} = reference.props;
                const {items = {}} = jsx;
                const {columns} = config;
                const options = [];
                for (let idx = 1; idx <= columns; idx++) {
                    const option = {};
                    option.value = `${idx}`;
                    option.key = `${idx}`;
                    option.label = __Zn.formatExpr(items.display, {column: idx});
                    options.push(option);
                }
                // 禁用操作
                const type = __Zn.formHit(reference, "type");
                if ("WEB" !== type) {
                    jsx.disabled = true;
                }
                return __Zn.aiRadio(reference, {
                    ...jsx,
                    config: {
                        items: options
                    }
                })
            }
        }
    }).then(raft => {
        state.raft = raft;
        state.$op = {
            $opSaveRow: (reference, jsx = {}) => (params = {}) => {
                const ref = __Zn.onReference(reference, 1);
                const {data = [], config = {}} = ref.props;
                // 当前表单处理
                __Zn.of(reference).load().handle(() => {
                    if (0 < data.length) {
                        // 只保留第一个 $cells
                        const columns = __Zn.valueInt(params.columns, 3);
                        const span = 24 / columns;
                        const newCells = __Zn.clone(data);
                        newCells.forEach(item => item.span = span);
                        // 行处理
                        // ref.?etState({$drawer: undefined});
                        __Zn.of(ref).in({
                            $drawer: undefined
                        }).handle(() => {
                            // 行数据
                            const rowData = {};
                            rowData.key = config.key;
                            rowData.data = newCells;
                            // 调用顶层
                            __Zn.fn(ref).rxRowConfig([rowData]);
                        })
                    }
                })
                // reference.?etState({
                //     $loading: false,
                //     $submitting: false
                // });
                // if (0 < data.length) {
                //     // 只保留第一个 $cells
                //     const columns = __Zn.valueInt(params.columns, 3);
                //     const span = 24 / columns;
                //     const newCells = __Zn.clone(data);
                //     newCells.forEach(item => item.span = span);
                //     // 行处理
                //     ref.?etState({$drawer: undefined});
                //     // 行数据
                //     const rowData = {};
                //     rowData.key = config.key;
                //     rowData.data = newCells;
                //     // 调用顶层
                //     __Zn.fn(ref).rxRowConfig([rowData]);
                // }
            }

        }
        return __Zn.promise(state);
    }).then(__Zn.ready).then(__Zn.pipe(reference));
}

@uca({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "Grid.Row.Setting",
})
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
        const {$inited = {}} = this.props;
        return (
            <div className={"viewer-layout"}>
                {__Zn.xtReady(this, () => __Zn.aiForm(this, $inited),
                    {component: LoadingContent}
                )}
            </div>
        )
    }
}

export default Component