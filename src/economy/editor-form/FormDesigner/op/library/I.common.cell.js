import Ux from "ux";

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
    let {$cells = []} = reference.state;
    const processed = [];
    $cells = Ux.clone($cells);
    // 查找鉴别值
    $cells.forEach(item => {
        const $item = Ux.clone(item);
        const key = item.span;
        if (compress) {
            if (MAP.COMPRESS[key]) {
                $item.span = MAP.COMPRESS[key];
            }
        } else {
            if (MAP.EXPAND[key]) {
                $item.span = MAP.EXPAND[key];
            }
        }
        processed.push($item);
    });
    return processed;
}
export default {
    cellSpans: ($cells = []) => $cells.map(cell => cell.span)
        .reduce((left, right) => left + right, 0),
    cellNew,
    cellWidth,
}