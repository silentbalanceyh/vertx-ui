import React from 'react';
import Ux from 'ux';
import Op from './Op';
import {Input, Table} from 'antd';
import {Dialog} from 'web';
import U from 'underscore';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Ux.xtInitArray(props, true);
    }

    componentDidMount() {
        Op.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuPage(this, {state: prevState, props: prevProps});
    }

    render() {
        return Ux.xtReady(this, () => {
            const {
                $table = {}, $dialog = {},
                $button = [],
                $visible = false,
                fnComponent = () => false,
                $inited = {},           // 初始化的值
                $mode,                  // Form的模式（同时添加和编辑）
                $submitting = false,    // 是否在提交状态
                data = [],              // 数据源
            } = this.state;
            const attrs = Ux.valueLimit(this.props);
            /*
             * 按钮专用处理（$dialog完善）
             */
            const ref = Ux.onReference(this, 1);
            Ux.configScroll($table, data, ref);
            const {readOnly = false} = this.props;
            if (readOnly) {
                return (
                    <Input.Group {...attrs}>
                        {Ux.aiFloatError(this, !$visible)}
                        <Table {...$table} dataSource={data}
                               className={"web-table"}
                               loading={$submitting}/>
                    </Input.Group>
                )
            } else {
                return (
                    <Input.Group {...attrs}>
                        {Ux.aiFloatError(this, !$visible)}
                        <Table {...$table} dataSource={data}
                               className={"web-table"}
                               loading={$submitting}/>
                        <Dialog className={"web-dialog"}
                                size={"small"}
                                $visible={$visible}
                                $loading={$submitting}
                                $dialog={$dialog}>
                            {U.isFunction(fnComponent) ?
                                fnComponent($inited, $mode) :
                                false}
                        </Dialog>
                        {Ux.aiButtonGroup(this, $button)}
                    </Input.Group>
                )
            }
            ;
        }, {name: "DialogEditor", logger: true})
    }
}

export default Component;