import React from 'react';
import Ux from 'ux';
import {Alert} from 'antd';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        // 这里读取资源文件
        const title = Ux.fromPath(this, "info", "title");
        const comment = Ux.fromPath(this, "info", "comment");
        return (
            <Alert message={title}
                   description={comment}/>
        )
    }
}

export default Component