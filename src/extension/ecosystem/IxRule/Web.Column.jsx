import React from 'react';
import {Button, Icon, Tag} from 'antd';
import Ux from 'ux';
import Event from './event';

export default (reference, columns = [], target = {}) => {
    const {config = {}} = reference.props;
    let $columns = Ux.clone(columns);
    if (config.sort) {
        $columns = $columns.concat([target.column]);
    }
    $columns.forEach(column => {
        if ("key" === column.dataIndex) {
            column.render = (text, record, index) => {
                return (
                    <Button.Group>
                        <Button icon={"plus"} type={"primary"}
                                onClick={Ux.xtRowAdd(reference, record, index)}/>
                        <Button icon={"delete"}
                                onClick={event => Ux.xtRowDel(reference, record, index)(event)
                                    .then(merged => {
                                        if (merged) {
                                            // 清空当前
                                            Event.doClean(reference, record);
                                        }
                                    })
                                }/>
                    </Button.Group>
                );
            }
        }
        if ("ruleName" === column.dataIndex) {
            column.render = (text, record = {}, index) => {
                const {rules = []} = record;
                const pending = Ux.fromHoc(reference, "pending");
                return (
                    <span>
                        {`${pending.name}${index + 1}`}&nbsp;
                        {0 === rules.length ? (
                            <Icon type={"close-circle"} theme={"filled"}
                                  style={{color: "#ff3b1a"}}/>
                        ) : (
                            <Icon type={"check-circle"} theme={"filled"}
                                  style={{color: "#33af43"}}/>
                        )}
                    </span>
                )
            }
        }
        if ("rules" === column.dataIndex) {
            column.render = (text, record = {}) => {
                let rules = [];
                if (text) {
                    rules = text;
                }
                return (
                    <span>
                        {rules.map(rule => {
                            return (
                                <Tag key={rule} closable
                                     onClose={Event.onClose(reference, record, rule)}>{rule}</Tag>
                            )
                        })}
                    </span>
                )
            }
        }
        if ("sorter" === column.dataIndex) {
            column.render = (text, record, index) => {
                const {data = []} = reference.state;
                return (
                    <Button.Group>
                        <Button icon={"arrow-up"} size={"small"}
                                shape={"circle"} disabled={0 === index}
                                onClick={Event.onSort(reference, index)}/>
                        <Button icon={"arrow-down"} size={"small"}
                                shape={"circle"} disabled={(data.length - 1) === index}
                                onClick={Event.onSort(reference, index, false)}/>
                    </Button.Group>
                )
            }
        }
    });
    return $columns;
}