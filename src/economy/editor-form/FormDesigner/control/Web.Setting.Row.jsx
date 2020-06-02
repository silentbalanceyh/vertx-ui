import React from "react";
import {component} from "../../../_internal";
import Ux from "ux";
import LoadingContent from "../../../loading/LoadingContent/UI";
import {Form} from "antd";

const yiInternal = (reference) => {
    const state = {};
    Ux.raftForm(reference, {
        id: "SubForm-GridRow",
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
                const {grid} = config;
                const options = [];
                for (let idx = 1; idx <= grid; idx++) {
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
                // 行属性直接更改系统中的 $cells 变量
                const ref = Ux.onReference(reference, 1);
                const {$cells = []} = ref.state;
                if (0 < $cells.length) {
                    // 只保留第一个 $cells
                    const columns = Ux.valueInt(params.columns, 3);
                    const span = 24 / columns;
                    const newCells = Ux.clone($cells);
                    newCells.forEach(item => item.span = span);
                    ref.setState({$cells: newCells, $drawer: undefined});
                }
                reference.setState({
                    $loading: false,
                    $submitting: false
                });
            }

        }
        return Ux.promise(state);
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "Grid.Row",
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