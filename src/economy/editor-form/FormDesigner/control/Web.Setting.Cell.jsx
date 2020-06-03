import React from 'react';
import {component} from "../../../_internal";
import Ux from "ux";
import LoadingContent from "../../../loading/LoadingContent/UI";
import {Form} from "antd";
import Image from '../images';
import Op from '../op';

const yiInternal = (reference) => {
    const state = {};
    const {$inited = {}} = reference.props;
    const {render = {}} = $inited;
    Ux.raftForm(reference, {
        id: "SubForm-Cell-Setting",
        renders: {
            field: (reference, jsx) => {
                Op.Setting.field(reference, jsx);
                return Ux.aiSelect(reference, jsx);
            },
            render: (reference, jsx) => {
                const img = Image[render.key];
                return (
                    <span className={"render"}>
                        <img src={img} alt={render.key}/>
                        <label>
                            {render.text}
                        </label>
                    </span>
                )
            }
        }
    }).then(raft => {
        state.raft = raft;
        return Ux.promise(state);
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "Grid.Cell.Setting",
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