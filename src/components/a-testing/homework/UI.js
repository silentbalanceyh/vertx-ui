import React from 'react';
import Ux from 'ux';
import {Alert} from 'antd';
import {Tag} from 'antd';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab'))
    .cab("UIHomework")
    .to()
)
class Component extends React.PureComponent {
    render() {
        // 这里读取资源文件
        const tag1 = Ux.fromPath(this, "info", "tag1");
        const link = Ux.fromPath(this, "info", "link");
        const tag2 = Ux.fromPath(this,"info","tag2");
        return (
            <div>
                <Tag closable><a href={link}>{tag1}</a></Tag>
                <Tag color="magenta">{tag2}</Tag>
            </div>
        )
    }
}

export default Component