import Ux from 'ux';

const yiPage = (reference) => {
    const state = {};
    state.$ready = true;
    const {data = [], $app} = reference.props;
    /*
     * 过滤菜单
     */
    let filtered = Ux.clone(data)
        .filter(item => "APP-MENU" === item.type)
        .sort((left, right) => left.sort - right.sort);
    state.$data = Ux.toLink(filtered, $app);
    reference.setState(state);
};
const COLORS = [
    "#48aaf7",
    "#d00036",
    "#44bc78",
    "#030f1f",
    "#e79627",
    "#7d4ab8",
    "#70d5fe",
    "#7077eb"
];
const toColor = (current) => {
    if (undefined === current) {
        const index = Ux.randomInteger(0, COLORS.length);
        return COLORS[index];
    } else {
        const index = current % COLORS.length;
        return COLORS[index];
    }
};
export default {
    yiPage,
    toColor,    // 自由颜色
}