import React from 'react'
import './Cab.less'
import {_zero} from '../../_internal/index';
import {DataLabor} from 'entity';
import Ux from "ux";
import Op from "./Op";
import Rdr from './UI.Render';
import Table from './UI.Table';

@_zero({
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "grid": ["query", "list", "tree"]
            })
            .rinit(["query"])
            .rinit(["tree"], true)
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
        if (!verified) {
            Op.initGrid(this);
        } else {
            this.setState({error: verified});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        Op.updateGrid(this, prevProps);
    }

    render() {
        const ref = this;
        const {
            // 添加专用
            rxAdd, rxEdit, rxSearch,
            // 列表数据
            $query, $list,
            // 父类引用
            reference
        } = this.props;
        const attrs = Ux.toUniform(this.props);
        // 需要传给Table专用的
        attrs.reference = reference;
        if (rxAdd) attrs.rxAdd = rxAdd;
        if (rxEdit) attrs.rxEdit = rxEdit;
        if (rxSearch) attrs.rxSearch = rxSearch;
        return Ux.fxRender(this, () => {
            return Rdr.renderLayout(ref,
                <Table {...attrs} $query={$query} $list={$list}/>
            )
        });
    }
}

export default Component