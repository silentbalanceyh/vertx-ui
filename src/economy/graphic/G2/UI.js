import React from 'react'
import Ux from 'ux';

class Component extends React.PureComponent {
    componentDidMount() {
        const {config = {}, $gid = "", $gFn} = this.props;
        const state = {};
        if (Ux.isFunction($gFn)) {
            const $g2 = $gFn($gid, config);
            state.$g2 = $g2;
            // 添加方法
            const {data = []} = this.props;
            Ux.g2Add($g2, data);
        }
        state.$ready = true;
        this.setState(state);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // 数据变更
        const {$ready = false} = this.state;
        if ($ready) {
            const current = this.props.data;
            const previous = prevProps.data;
            if (Ux.isDiff(current, previous)) {
                // 重绘
                const {$g2} = this.state;
                Ux.g2Update($g2, current);
            }
        }
    }

    render() {
        const {$gid = ""} = this.props;
        return $gid ? (
            <div id={$gid}/>
        ) : (
            <div>$gid is Null</div>
        )
    }
}

export default Component