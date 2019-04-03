import React from 'react';
import './Cab.less';
import {_zero} from '../../_internal/index';
import {DataLabor} from 'entity';
import Ux from "ux";
import Op from "./op/Op";
import Rdr from './UI.Render';
import TabList from '../TabList/UI';

@_zero({
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "grid": ["tree", "query", "editable"],
                "tree.row": ["add"]
            })
            .rinit(["tree"], true)
            .rinit(["query", "add"])
            .to()
    },
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
    state: {
        selected: undefined // 被选中的节点
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        // 验证当前组件是否准备完成
        const {reference, $key = "grid"} = this.props;
        const verified = Ux.verifyTreeList(reference, $key);
        if (verified) {
            this.setState({error: verified});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        Op.updateGrid(this, prevProps);
    }

    render() {
        const ref = this;
        return Ux.fxRender(this, () => {
            return Rdr.renderLayout(ref,
                <TabList {...this.props} $fastAdd={Op.isEnableRowAdd(this)}/>
            );
        });
    }
}

export default Component;