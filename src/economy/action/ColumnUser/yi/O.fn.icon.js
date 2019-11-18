export default (reference) => {
    const {$system = false} = reference.state;
    const attrs = {};
    if ($system) {
        /*
         * 通常是未设置
         */
        attrs.type = "setting";
        attrs.style = {
            color: "#7D7D7D",
            fontSize: 16
        };
    } else {
        /*
         * 设置了参数
         */
        const {$icon} = reference.props;
        if ($icon && "string" === typeof $icon) {
            /*
             * 自定义了图标
             */
            const parsed = $icon.split(',');
            attrs.type = parsed[0];
            attrs.style = {fontSize: 16};
            attrs.style.color = parsed[1];
        } else {
            /*
             * 未自定义图标，默认
             */
            attrs.type = "user";
            attrs.style = {
                color: "#CD2990",
                fontSize: 16
            }
        }
    }
    return attrs;
}