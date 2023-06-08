import Ux from 'ux';

const Cv = Ux.Env;
const mapUri = (item = {}, $app) => {
    if (item.uri) {
        if (Ux.Env.VALUE.MENU_EXPAND !== item.uri) {
            item.uri = Ux.toUri(item.uri, $app);
        } else {
            item.uri = undefined;
        }
    }
    return item;
};
const mapMeta = (data = {}) => {
    if ("string" === typeof data.metadata) {
        data.metadata = Ux.toJson(data.metadata);
    }
    return data;
};

const mapAsyncDatum = (columns = [], reference) => {
    const datum = {};
    columns.filter(column => column.hasOwnProperty(Cv.K_NAME.RENDER)).forEach(column => {
        const name = column.dataIndex;
        const render = column[Cv.K_NAME.RENDER];
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
                    const output = Ux.valueDatetime(data);
                    if (Ux.isMoment(output)) {
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
    mapAsyncDatum,
}