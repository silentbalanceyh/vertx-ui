import Ux from 'ux';
import Ex from 'ex';

import React from 'react';
import {Icon, Input, Tag} from 'antd';
import FormSearch from './form/UI.Search';

import Event from './Op.Event';
import Op from './Op';

export default {
    searchInput: (reference) => {
        const search = Ux.fromHoc(reference, "search");
        const {$keyword} = reference.state;
        return (<Input.Search {...search.input}
                              value={$keyword}
                              onChange={Event.$opSearchChange(reference)}
                              onSearch={Event.$opSearchQuick(reference)}/>)
    },
    searchLink: (reference) => {
        const search = Ux.fromHoc(reference, "search");
        const {$searchExpand = false, $query = {}} = reference.state;
        const criteria = $query.criteria ? $query.criteria : {}
        return (
            <div>
                <a href={"#"} onClick={event => {
                    Ux.prevent(event);
                    reference.setState({$searchExpand: !$searchExpand});
                }}>
                    {search.condition}
                    &nbsp;
                    {$searchExpand ? <Icon type={"up"}/> : <Icon type={"down"}/>}
                </a>
                &nbsp;
                &nbsp;
                &nbsp;
                {criteria.keyword ? (
                    <Tag color={"red"} closable style={{
                        fontSize: 14
                    }} onClose={event => {
                        Ux.prevent(event);
                        const $query = Op.rxDataQuery(reference, "keyword", null);
                        Op.rxDataRefresh(reference, $query);
                    }}>{Ux.formatExpr(search.tag, criteria, true)}</Tag>
                ) : false}
            </div>
        )
    },
    searchForm: (reference) => {
        const {$searchExpand = false, $submitting = false} = reference.state;
        return $searchExpand ? (<FormSearch {...Ex.yoAmbient(reference)}
                                            $submitting={$submitting}
                                            rxSubmit={Op.rxDataSearch(reference)}/>) : false;
    }
}