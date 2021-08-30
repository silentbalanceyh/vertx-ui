import React from 'react';
import Ux from "ux";
import Ex from "ex";
import QxCriteria from '../QxCriteria/UI';
import QxProjection from '../QxProjection/UI';
import Op from './Op';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("ExView")
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
            const {config = {}} = reference.props;
            const {field = []} = config;
            const jsxConfig = jsx.config ? jsx.config : {};
            return (<QxCriteria reference={reference} {...jsx}
                                config={{
                                    ...jsxConfig,
                                    field
                                }}/>)
        }
    })
    .bind(Op)
    .to()
)
class Component extends React.PureComponent {
    render() {
        return Ex.yoRender(this, () => Ux.aiForm(this),
            Ex.parserOfColor("ExView").form())
    }
}

export default Component