import Ux from 'ux';
import React from 'react';
import {Button, Table} from 'antd';
import './Cab.less';

export default (reference, {
    table = {},
    data = []
}) => Ux.isEmpty(table) ? false : (
    <div>
        <Table {...table} dataSource={data}/>
        {/* 按钮操作用于刷新 Refresh 处理，重新加载列表 */}
        <Button id={"__BTN_REFRESH"} className={"ux-hidden"}
                onClick={event => {
                    /*
                     * Dirty Refresh 按钮，外层专用
                     */
                    Ux.prevent(event);
                    /*
                     * $dirty 和 $loading 必须同时，否则无法生效
                     */
                    reference.setState({$dirty: true, $loading: true});
                }}/>
    </div>
)