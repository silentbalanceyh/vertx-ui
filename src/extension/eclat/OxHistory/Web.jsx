import {Table} from "antd";
import React from "react";
import {ExTrackField} from 'ei';
import Ex from 'ex';
import Ux from 'ux';

export default {
    renderTime: (reference) => () => {
        const {$data = [], $table = {}, $loading = false} = reference.state;
        const info = Ux.fromHoc(reference, "info");
        return (
            <Table {...$table} dataSource={$data} loading={{
                tip: info.loading,
                delay: 100,
                spinning: $loading
            }}/>
        )
    },
    renderField: (reference) => () => {
        const columns = Ux.onDatum(reference, "model.columns");
        const options = [];
        columns.forEach(column => {
            const option = {};
            const {title, dataIndex} = column;
            if (dataIndex && title) {
                option.key = dataIndex;
                option.label = title;
                option.value = dataIndex;
                options.push(option);
            }
        });
        // 当前表单数据，包含了CI的主键
        const {$inited = {}} = reference.props;
        const {$dict = {}} = reference.state;
        return (
            <ExTrackField {...Ex.yoAmbient(reference)}
                          $dict={$dict}
                          $fields={options}
                          $inited={$inited}/>
        )
    }
}