const optionFormItem = (item = {}) => {
    return (item.labelCol) ? item : {
        ...item,
        style : {
            width : "90%"
        },
        labelCol : {
            span : 8
        },
        wrapperCol : {
            span : 16
        }
    }
};
export default {
    optionFormItem
}
