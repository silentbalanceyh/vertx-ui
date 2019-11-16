import Ux from "ux";
import moment from "moment";
import U from "underscore";
import To from './func.to';
import mapButtons from './func.map.buttons';

const mapMeta = (data = {}) => {
    if ("string" === typeof data.metadata) {
        data.metadata = Ux.toJson(data.metadata);
    }
    return data;
};

const mapUri = (item = {}, $app) => {
    if ($app && U.isFunction($app.is) && item.uri) {
        if ("EXPAND" !== item.uri) {
            item.uri = To.toUri(item.uri, $app);
        } else {
            item.uri = undefined;
        }
    }
    return item;
};
const mapAsyncDatum = (columns = [], reference) => {
    const datum = {};
    columns.filter(column => column.hasOwnProperty("$render")).forEach(column => {
        const name = column.dataIndex;
        const render = column['$render'];
        if ("DATUM" === render) {
            const normalized = Ux.Ant.toUnique(reference, column);
            /*
             * 转换成：value = display 的格式
             */
            const {data = [], config = {}} = normalized;
            const {display, value} = config;
            if (display && value) {
                const datumData = {};
                data.filter(record => !!record[value])
                    .filter(record => !!record[display])
                    .forEach(record => datumData[record[value]] = record[display]);
                if (!Ux.isEmpty(datumData)) {
                    datum[name] = datumData;
                }
            }
        } else if ("DATE" === render) {
            datum[name] = (data) => {
                if (data) {
                    const {$format = ""} = column;
                    const output = Ux.valueTime(data);
                    if (moment.isMoment(output)) {
                        /*
                         * 时间格式转换值
                         */
                        return output.format($format);
                    }
                }
                return data;
            };
        }
    });
    return Ux.promise(datum);
};
export default {
    mapUri,
    mapMeta,
    mapButtons,
    mapAsyncDatum,
}
