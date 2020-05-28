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
                console.info(params);
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