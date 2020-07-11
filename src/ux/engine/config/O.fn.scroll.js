import U from 'underscore';
import moment from 'moment';
import Abs from '../../abyss';
import Ele from '../../element';
import Ut from '../../unity';
import Rx from '../expression';
/*
 * 像素转换：12px
 */
const px = 12;
const widthString = (input) => {
    let length = 0;
    if ("string" !== typeof input) {
        return 0;
    }
    for (let idx = 0; idx < input.length; idx++) {
        const str = String(input.charAt(idx));
        if (Abs.isCn(str)) {
            // 中文字符长度
            length += (2 * px);
        } else {
            // 英文字符长度
            length += px;
        }
    }
    return length;
    /*
    if (Abs.isCn(input)) {
        return input.length * px * 2;
    } else {
        return input.length * px;
    }*/
};
const widthData = (data = [], field = "") => {
    let defaultWidth = 0;
    data.forEach(record => {
        const literal = record[field];
        let calculated = 0;
        if (literal) {
            calculated = widthString(literal);
        } else {
            calculated = widthString(record);
        }
        if (defaultWidth < calculated) {
            defaultWidth = calculated;
        }
    });
    return defaultWidth;
};
const widthTitle = (title = "", column = {}) => {
    let titleWidth = widthString(title);
    if (column.sorter) {
        titleWidth += (px * 2);
    }
    if (column.hasOwnProperty("$filter")) {
        titleWidth += (px * 2);
    }
    return titleWidth;
};
// --------------- 分界线 ---------------
const widthExecutor = (titleWidth = 0, column = {}, data = []) => {
    let width = 0;
    if (U.isArray(column['$option'])) {
        column['$option'].forEach(opt => {
            if ("divider" === opt) {
                width += 10;
            } else {
                const single = widthString(opt.text);
                width += single;
            }
        })
    }
    return titleWidth > width ? titleWidth : width;
};
const widthText = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = widthData(data, column.dataIndex);
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthLogical = (titleWidth = 0, column = {}, data = []) => {
    const mapping = Object.keys(column['$mapping'])
        .map(key => column['$mapping'][key]);
    const textWidth = widthData(mapping);
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthUser = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = 12 * px;      // 创建人默认（一个图标 + 4个字）
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthDate = (titleWidth = 0, column = {}, data = []) => {
    let textWidth = 0;
    const format = column['$format'];
    data.map(record => record[column.dataIndex])
        .filter(value => !!value)
        .map(value => Ele.valueTime(value, format))
        .filter(moment.isMoment)
        .map(value => value.format(format))
        .map(widthString)
        .forEach(current => {
            if (textWidth < current) {
                textWidth = current;
            }
        });
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthDatum = (titleWidth = 0, column = {}, data = [], reference) => {
    const options = Rx.Ant.toUnique(reference, {datum: column['$datum']});
    const source = options.data;
    const {value, display} = options.config;
    let textWidth = 0;
    data.map(record => record[column.dataIndex])
        .filter(value => !!value)
        .map(text => Ele.elementUnique(source, value, text))
        .filter(found => !!found)
        .map(found => Ut.valueExpr(display, found, true))
        .map(found => widthString(found))
        .forEach(current => {
            if (textWidth < current) {
                textWidth = current; // 暂时使用固定值，防止越界
            }
        });
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const FUNS = {
    "EXECUTOR": widthExecutor,
    "TEXT": widthText,
    "INPUT": widthText,
    "LOGICAL": widthLogical,
    "USER": widthUser,
    "DATE": widthDate,
    "DATUM": widthDatum,
};
/**
 * ## 引擎函数
 *
 * 计算表格中的 `scroll` 列自适应性的专用函数，不同的渲染器计算列宽度方法不同。
 *
 * @memberOf module:_config
 * @method configScroll
 * @param {Object} $table 传入的表格配置信息。
 * @param {Array} data 传入的表格数据信息。
 * @param {ReactComponent} reference React对应组件引用。
 */
export default ($table = {}, data = [], reference) => {
    const $columns = $table.columns;
    /*
     * 计算当前列的最大长度
     */
    // eslint-disable-next-line
    let width = 0;
    // eslint-disable-next-line
    let adjust = 0;
    const report = {};
    $columns.forEach(column => {
        /*
         * 当前列的数据信息
         * rdData：当前数据列所有数据信息
         * rdType：当前数据列渲染方式
         * rdTitle：当前数据列的标题长度
         * rdWidth：当前数据列是否设置了宽度
         */
        const rdType = column['$render'] ? column['$render'] : "INPUT";
        const rdTitle = column.title;
        const rdWidth = column.width;
        if (rdWidth) {
            /*
             * 有宽度的情况，直接叠加（有数据）
             */
            if (0 < data.length) {
                width += column.width;
            }
        } else {
            const executor = FUNS[rdType];
            if (U.isFunction(executor)) {
                const titleWidth = widthTitle(rdTitle, column);
                const calculated = executor(titleWidth, column, data, reference);
                if (0 < calculated) {
                    /*
                     * 只有 fixed 的时候才能设置 width
                     */
                    if (column.fixed) {
                        column.width = calculated;
                        adjust = calculated;
                    } else {
                        column.width = calculated;
                    }
                    if (0 < data.length) {
                        /* （有数据）*/
                        width += calculated;
                    }

                    /* 基础修正 */
                    if (undefined !== column.width && column.width < 84) {
                        delete column.width;
                    }
                }
            }
        }
        /*
         * 报表用于计算最终的列宽
         */
        report[rdTitle] = rdType + "," + width + `,` + column.width + "," + adjust; // column.width;
    });
    /*
     * 可支持的最大宽度
     * 未配置 scroll 的时候计算，配置了就不用计算了
     */
    if (!$table.scroll || !$table.scroll.x) {
        /*
         * 基础计算：必须是超过6列才执行
         */
        if (!$table.scroll) {
            $table.scroll = {};
        }
        $table.scroll.x = 'max-content';  //width + adjust * 2;
        /*
         * className 计算
         */
        let className = $table.className;
        if (!className) {
            className = "";
        }
        className = `${className} web-table-adjust`;
        $table.className = className;
    }
}