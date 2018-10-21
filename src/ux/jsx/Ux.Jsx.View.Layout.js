import Value from '../Ux.Value';

const KEYS = {
    // span - index - size
    1024: "4,20",
    // 12,12
    2012: "8,16",
    2112: "8,16",
    // 8,4,12
    3008: "12,12",
    3104: "10,14",
    3212: "8,16",
    // 8, 8, 8
    3108: "12,12",
    3208: "12,12",
    // 8,4,8,4
    4008: "12,12",
    4104: "10,14",
    4208: "12,12",
    4304: "10,14"
};
const getSpan = (config = {}) => {
    const {_flex, _index, _size} = config;
    const span = _flex.spans[_index];
    const key = `${_size}${_index}${span < 10 ? "0" : ""}${span}`;
    const literal = KEYS[key];
    const attrs = {
        valueStyle: {},
        labelStyle: {}
    };
    if (literal) {
        const splitted = literal.split(",");
        attrs.label = Value.valueInt(splitted[0]);
        attrs.value = Value.valueInt(splitted[1]);
    } else {
        attrs.label = 4;
        attrs.value = 20;
    }
    if (_index !== 0) {
        // 如果不是第一个元素时，需要设置左边的边框
        attrs.labelStyle.borderLeft = "solid 1px black";
    }
    if (config.hasOwnProperty('minHeight')) {
        attrs.labelStyle.minHeight = config.minHeight;
        attrs.valueStyle.minHeight = config.minHeight;
    }
    return attrs;
};
export default getSpan;