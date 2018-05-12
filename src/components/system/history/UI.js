import React from 'react'
import {Card} from 'antd';

class Component extends React.PureComponent {
    render() {
        const {$router} = this.props;
        return (
            <Card className={"page-card"} bordered={false}>
                {$router.path()}
            </Card>
        )
    }
}

export default Component