import Ux from 'ux';
import React from 'react';
import {Switch} from 'antd';
import Op from './op';

export default (reference) => {
    const tool = Ux.fromHoc(reference, "toolbar");
    const attrs = Op.yoSwitcher(reference);
    return (
        <div>
            <Switch {...attrs}
                    checkedChildren={tool.tips}
                    unCheckedChildren={tool.tips}/>
        </div>
    )
}