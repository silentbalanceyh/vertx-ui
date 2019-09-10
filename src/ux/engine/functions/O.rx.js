/*
 * 根据分辨率计算核心高度
 * 1）width > 1400 的宽度：默认 - 48
 * 3）width > 1900 的宽度：默认 - 56
 */
import T from "./O.to";

const rxResize = (reference) => (adjust = 0) => {
    const maxHeight = T.toHeight(adjust);
    let $heightStyle = {style: {maxHeight}};
    reference.setState({$heightStyle});
};
export default {
    rxResize,
}