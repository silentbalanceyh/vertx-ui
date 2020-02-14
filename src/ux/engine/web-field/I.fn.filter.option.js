export default (inputText, option) => {
    const {props = {}} = option;
    // 先做 value 匹配
    const {value, children} = props;
    if (0 <= value.indexOf(inputText)) {
        return true;
    } else {
        return (0 <= children.indexOf(inputText))
    }
}