import Abs from "../../../abyss";
import Eng from "../../../engine";

const g6Source = (reference, graphic) => {
    const source = graphic.source;
    const {data = {}, ...rest} = source;
    const $source = rest;
    if (!Abs.isEmpty(data)) {
        const $data = {};
        Object.keys(data).forEach(field => {
            const datum = Eng.onDatum(reference, data[field]);
            if (datum) {
                $data[field] = datum;
            }
        });
        $source.data = $data;
    }
    return $source;
};
const g6Start = (reference) => {
    /* 节点配置 */
    const inputConfig = reference.props.$graphic;

    /* 读取 _graphic */
    const graphic = Eng.fromHoc(reference, "graphic");
    if (!graphic) {
        throw new Error("当前Api调用必须配置 _graphic 属性");
    }
    if (inputConfig) {
        /* 传入配置优先 */
        Object.assign(graphic, inputConfig);
    }
    return graphic;
};
export default {
    g6Source,
    g6Start,
}