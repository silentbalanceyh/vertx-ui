import React from 'react';
import Op from './Op';
import Ux from "ux";
import {Table} from 'antd';

class Component extends React.PureComponent {
    state = {
        $columns: [],
        $data: []
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        const {$columns = [], $data = []} = this.state;
        const {$config = {}} = this.props;
        const {button} = $config;
        const reference = this;
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] UiEditorBatch：", "#960");
        return (
            <div>
                <Table className={"web-table"}
                       dataSource={$data}
                       columns={$columns}
                       pagination={false}/>
                {Ux.rtPure(reference, {
                    id: button,
                    className: "ux-hidden",
                    onClick: Op.submit(reference)
                })}
            </div>
        );
    }
}

export default Component;