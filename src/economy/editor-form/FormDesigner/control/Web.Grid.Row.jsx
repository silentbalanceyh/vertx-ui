import React from "react";
import {component} from "../../../_internal";
import Ux from "ux";
import LoadingContent from "../../../web/LoadingContent/UI";
import {Form} from "antd";

const yiInternal = (reference) => {
    const state = {};
    Ux.raftForm(reference, {
        id: "SubForm-Row-Setting",
        renders: {
            type: (reference, jsx) => {
                return Ux.aiRadio(reference, jsx, item => {
                    const value = Ux.ambEvent(item);
                    if ("WEB" !== value) {
                        Ux.formHit(reference, "columns", "1");
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
                    option.label = Ux.formatExpr(items.display, {column: idx});
                    options.push(option);
                }
                // 禁用操作
                const type = Ux.formHit(reference, "type");
                if ("WEB" !== type) {
                    jsx.disabled = true;
                }
                return Ux.aiRadio(reference, {
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
                const ref = Ux.onReference(reference, 1);
                const {data = [], config = {}} = ref.props;
                // 当前表单处理
                reference.setState({
                    $loading: false,
                    $submitting: false
                });
                if (0 < data.length) {
                    // 只保留第一个 $cells
                    const columns = Ux.valueInt(params.columns, 3);
                    const span = 24 / columns;
                    const newCells = Ux.clone(data);
                    newCells.forEach(item => item.span = span);
                    // 行处理
                    ref.setState({$drawer: undefined});
                    // 行数据
                    const rowData = {};
                    rowData.key = config.key;
                    rowData.data = newCells;
                    // 调用顶层
                    Ux.fn(ref).rxRowConfig([rowData]);
                }
            }

        }
        return Ux.promise(state);
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@component({
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
                {Ux.xtReady(this, () => Ux.aiForm(this, $inited),
                    {component: LoadingContent}
                )}
            </div>
        )
    }
}

export default Form.create({})(Component)