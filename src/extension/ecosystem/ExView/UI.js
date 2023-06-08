import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {QxCriteria} from 'zei';
import QxProjection from '../QxProjection/UI';
import Op from './Op';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "ExView";

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab(UCA_NAME)
    .form().raft(2)
    .raft({
        projection: (reference, jsx = {}) => {
            const {config = {}} = reference.props;
            const {field = []} = config;
            if (jsx.config) {
                jsx.config.field = field;
            }
            return (<QxProjection reference={reference} {...jsx}/>);
        },
        criteria: (reference, jsx = {}) => {
            const {config = {}, $query} = reference.props;
            const {field = []} = config;
            const jsxConfig = jsx.config ? jsx.config : {};
            return (<QxCriteria reference={reference} {...jsx}
                                {...Ux.toAssist(reference)}
                                config={{
                                    ...jsxConfig,
                                    field,
                                    query: $query,
                                }}/>)
        }
    })
    .bind(Op)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    render() {
        return Ex.yoRender(this, () => {
            const attrInput = Sk.mixEx(UCA_NAME);
            return (
                <div {...attrInput}>
                    {Ux.aiForm(this)}
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).form())
    }
}

export default Component