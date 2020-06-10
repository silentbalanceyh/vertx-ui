import Ux from "ux";
import cellConfig from './I.common.cell.config';

const cellSpans = (data = []) => data.map(cell => cell.span)
    .reduce((left, right) => left + right, 0);
const cellSpanMin = (data = []) => data.map(cell => cell.span)
    .reduce((left, right) => {
        if (left < right) {
            return left;
        } else {
            return right;
        }
    }, 24);
const cellSpanMax = (data = []) => data.map(cell => cell.span)
    .reduce((left, right) => {
        if (left < right) {
            return right;
        } else {
            return left;
        }
    }, 0);
const cellSpanDim = (data = []) => {
    const spans = new Set();
    data.forEach(cell => spans.add(cell.span));
    return Array.from(spans);
}
const MAP = {
    COMPRESS: {
        24: 18,
        18: 16,
        16: 12,
        12: 8,
        8: 6
    },
    EXPAND: {
        6: 8,
        8: 12,
        12: 16,
        16: 18,
        18: 24
    }
}
const cellWidth = (reference, compress = false) => {
    const {data = []} = reference.props;
    const dim = cellSpanDim(data);
    const processed = [];
    if (1 === dim.length) {
        // 阶段2，所有的 span 对齐了
        data.forEach(cell => {
            const $cell = Ux.clone(cell);
            if (compress) {
                $cell.span = MAP.COMPRESS[cell.span];
            } else {
                $cell.span = MAP.EXPAND[cell.span];
            }
            processed.push($cell);
        })
    } else {
        /*
         * 阶段1，先对齐
         * 1）最大值扩展
         * 2）最小值压缩
         */
        let target;
        if (compress) {
            target = cellSpanMin(data);
        } else {
            target = cellSpanMax(data);
        }
        data.forEach(cell => {
            const cellItem = Ux.clone(cell);
            cellItem.span = target;
            processed.push(cellItem);
        })
    }
    return processed;
}

const cellNew = (span, row = {}) => {
    return {
        key: `cell-${Ux.randomString(8)}`,       // 默认的 key
        span,                                           // 默认宽度
        cellIndex: 0,                                   // 列索引
        rowIndex: row.rowIndex,                         // 行索引
        rowKey: row.key,                                // 行主键
    }
}
export default {
    cellNew,        // 创建新的单元格

    cellSpans,
    cellSpanMin,
    cellSpanMax,
    cellSpanDim,
    cellWidth,
    cellConfig,
}