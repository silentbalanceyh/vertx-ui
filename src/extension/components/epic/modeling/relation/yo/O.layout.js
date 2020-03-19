const yoLeft = (reference) => {
    const {$expand = false} = reference.state;
    const attrs = {};
    attrs.span = $expand ? 23 : 20;
    return attrs;
};
const yoRight = (reference) => {
    const {$expand = false} = reference.state;
    const attrs = {};
    attrs.span = $expand ? 1 : 4;
    return attrs;
};
export default {
    yoLeft,
    yoRight
}