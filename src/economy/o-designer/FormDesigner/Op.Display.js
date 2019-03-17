const calcCellStyle = (props) => {
    const {isOver} = props;
    // 拖拽颜色处理
    const isActive = isOver;
    const style = {};
    if (isActive) {
        style.backgroundColor = "lightblue";
        style.opacity = 0.3;
    } else {
        style.backgroundColor = "white";
    }
    return style;
};
export default {
    calcCellStyle
};