import Ex from "ex";
import Ux from 'ux';
import React from 'react';
import {Tag} from 'antd';
/*
 * 初始化 query（根据条件读取 query ）
 */
const yiQuery = (reference) => {
    const {$query} = reference.state;
    if ($query) {
        return Ux.clone($query);
    } else {
        const query = {};
        query.projection = [];
        query.pager = Ux.fromPath(reference, "pagination", "pager")
        query.sorter = [
            "updatedAt,DESC"
        ];
        query.criteria = {};
        return query;
    }

}

const yiData = (reference, state = {}) => {
    /*
     * 查询条件
     */
    const query = yiQuery(reference);
    /*
     * 数据处理
     */
    return Ex.I.jobs(query).then((data = {}) => {
        /*
         * $data：       数据
         * $current：    当前页码
         */
        state.$data = data.list ? data.list : [];
        state.$pagination = Ux.toPagination(data, query, {
            size: "small",
            showTotal: (count) => {
                const totalExpr = Ux.fromPath(reference, "pagination", "total");
                return (
                    <Tag color={"geekblue"} style={{
                        fontSize: 14
                    }}>
                        {Ux.formatExpr(totalExpr, {count})}
                    </Tag>
                )
            },
        });
        state.$query = query;
        state.$aggregation = data.aggregation;
        state.$loading = false;
        return Ux.promise(state);
    })
}

export default {
    yiData,
}