import U from 'underscore';
import moment from 'moment';
import Ele from '../../element';
import Ut from '../../unity';
import Rx from '../expression';
import Wd from './I.scroll.width';

const widthObject = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = Wd.widthMax(data, column.dataIndex, Wd.widthObject);
    return titleWidth > textWidth ? titleWidth : textWidth;
}
const widthArray = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = Wd.widthMax(data, column.dataIndex,
        Wd.widthArray, column // 传入 column 引用，如果是 Array 可能会被更改
    );
    return titleWidth > textWidth ? titleWidth : textWidth;
}
const widthText = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = Wd.widthMax(data, column.dataIndex,
        Wd.widthMix, column // 传入 column 引用，如果是 Array 可能会被更改
    );
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthCurrency = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = Wd.widthMax(data, column.dataIndex, (input) => Wd.widthWord(Ut.formatCurrency(input)));
    return titleWidth > textWidth ? titleWidth : textWidth;
}
const widthMapping = (titleWidth = 0, column = {}, data = []) => {
    const mapping = Object.keys(column['$mapping'])
        .map(key => column['$mapping'][key]);
    const textWidth = Wd.widthOption(mapping);
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthExecutor = (titleWidth = 0, column = {}, data = []) => {
    let width = 0;
    if (U.isArray(column['$option'])) {
        /*
         * 多个按钮操作
         */
        column['$option'].forEach(opt => {
            if ("divider" === opt) {
                /*
                 * 分隔符操作
                 */
                width += 12;
            } else {
                /*
                 * 计算每一个的文字，累加
                 */
                const single = Wd.widthWord(opt.text, false);
                width += single;
            }
        });
        width += 32;
    }
    return titleWidth > width ? titleWidth : width;
};
const widthUser = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = 144;      // 创建人默认（一个图标 + 4个字）
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthDate = (titleWidth = 0, column = {}, data = []) => {
    let textWidth = 0;
    const format = column['$format'];
    if (0 < data.length) {
        data.map(record => record[column.dataIndex])
            .filter(value => !!value)
            .map(value => Ele.valueTime(value, format))
            .filter(moment.isMoment)
            .map(value => value.format(format))
            .map(Wd.widthWord)
            .forEach(current => {
                if (textWidth < current) {
                    textWidth = current;
                }
            });
    } else {
        // 修正无数据的最小日期格式
        textWidth = Wd.widthWord(format);
    }
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
        .map(Wd.widthWord)
        .forEach(current => {
            if (textWidth < current) {
                /*
                 * 暂时使用固定值，防止越界
                 */
                textWidth = current;
            }
        });
    textWidth += 24;        // 引入24的修正值
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const FUNS = {
    "EXECUTOR": widthExecutor,
    "TEXT": widthText,
    "CURRENCY": widthCurrency,
    "INPUT": widthText,
    "LOGICAL": widthMapping,
    "MAPPING": widthMapping,
    "USER": widthUser,
    "DATE": widthDate,
    "DATUM": widthDatum,
    "OBJECT": widthObject,
    "ARRAY": widthArray,
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

        /*
         * 计算 width 的新算法
         * 1）先根据 render 计算 width
         * 2）如果 width > rdWidth，那么修改原始的 width
         */
        const executor = FUNS[rdType];
        if (U.isFunction(executor)) {
            const titleWidth = Wd.widthTitle(rdTitle, column);
            const calculated = executor(titleWidth, column, data, reference);
            if (rdWidth && rdWidth < calculated) {
                // 只有这种时候重算
                column.width = calculated;
            } else {
                column.width = calculated;
            }
        }
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
        $table.scroll.x = 'fill-available';  //width + adjust * 2;
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