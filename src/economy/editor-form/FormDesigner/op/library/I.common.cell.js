import Ux from "ux";

const cellSpans = ($cells = []) => $cells.map(cell => cell.span)
    .reduce((left, right) => left + right, 0);
const cellSpanMin = ($cells = []) => $cells.map(cell => cell.span)
    .reduce((left, right) => {
        if (left < right) {
            return left;
        } else {
            return right;
        }
    }, 24);
const cellSpanMax = ($cells = []) => $cells.map(cell => cell.span)
    .reduce((left, right) => {
        if (left < right) {
            return right;
        } else {
            return left;
        }
    }, 0);
const cellSpanDim = ($cells = []) => {
    const spans = new Set();
    $cells.forEach(cell => spans.add(cell.span));
    return Array.from(spans);
}
const cellNew = (reference) => {
    const {config = {}} = reference.props;
    if (config.grid) {
        const span = 24 / config.grid;
        return {
            key: `cell-${Ux.randomString(8)}`,  // 默认的 key
            span,                               // 默认宽度
            cellIndex: 0,                       // 列索引
            rowIndex: config.rowIndex,          // 行索引
        }
    } else {
        console.error("丢失了重要参数 config.grid", config);
        throw new Error("丢失了重要参数！");
    }
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
    const {$cells = []} = reference.state;
    const dim = cellSpanDim($cells);
    const processed = [];
    if (1 === dim.length) {
        // 阶段2，所有的 span 对齐了
        $cells.forEach(cell => {
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
            target = cellSpanMin($cells);
        } else {
            target = cellSpanMax($cells);
        }
        $cells.forEach(cell => {
            const $cell = Ux.clone(cell);
            $cell.span = target;
            processed.push($cell);
        })
    }
    return processed;
}
export default {
    cellSpans,
    cellSpanMin,
    cellSpanMax,
    cellSpanDim,
    cellNew,
    cellWidth,
}