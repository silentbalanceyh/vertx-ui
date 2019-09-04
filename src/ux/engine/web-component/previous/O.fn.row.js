import React from 'react';
import {Row} from 'antd';

import Abs from '../../../abyss';

import Grid from '../../layout';
import Raft from '../../../engine/raft';

import Datum from '../../../engine/datum';

import Dft from './I.default';

import Jsx from './O.static';
import jsxColumn from './O.fn.column';

export default (reference = {}, renders = {}, column = 4, values = {}, config = {}) => {
    const span = 24 / column;
    // 行配置处理
    const {key = "form", entity} = config;
    let formConfig = Datum.fromHoc(reference, key);
    if (!formConfig) formConfig = {};
    const rowConfig = formConfig['rowConfig'] ? formConfig['rowConfig'] : {};
    const rowClass = formConfig['rowClass'] ? formConfig['rowClass'] : {};
    const {form = [], ...rest} = config;
    // 计算偏移量
    const adjustCol = Grid.aiAdjust(config.window);
    let spans = [];
    if (adjustCol && adjustCol.row) spans = adjustCol.row[column];
    // 读取配置数据
    return (
        <div>
            {Raft.cabHidden(reference, key).inputs.map(name => Jsx.jsxHidden(reference, name, values[name]))}
            {form.map((row, rowIndex) => {
                const rowKey = entity ? `form-row-${entity}-${rowIndex}` : `form-row-${rowIndex}`;
                const className = rowClass[rowIndex] ? rowClass[rowIndex] : "";
                return (
                    <Row key={rowKey} style={Dft.applyRow(row, rowConfig[rowIndex], config)}
                         className={className}>
                        {Abs.itRow(row).map((item, cellIndex) => {
                            item = Abs.clone(item);
                            // 填平高度
                            const rowStyle = rowConfig[rowIndex];
                            // 初始化 item
                            Raft.raftItem(item, values, {
                                rowStyle,                       // rowStyle 信息,
                                entity,                         // 动态 field
                                spanAdjust: spans[cellIndex],   // 修正 span
                            });
                            if (item.hasOwnProperty("title")) {
                                // 单Title
                                return Jsx.jsxTitle(item);
                            } else if (item.hasOwnProperty('grid')) {
                                return Jsx.jsxGrid(item);
                            } else {
                                return jsxColumn(reference, renders, item, {
                                    span,
                                    rowIndex,
                                    cellIndex,
                                    columns: Abs.itRow(row).length,
                                    ...rest
                                });
                            }
                        })}
                    </Row>
                );
            })}
        </div>
    );
};