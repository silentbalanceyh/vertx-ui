export default {
    layout: (reference, item) => {
        // 屏蔽主操作
        reference.setState({
            $forbidden: true,    // 禁止屏幕主操作
            $popover: item.key,  // 打开 Popover
        });
    },
    "deployment-unit": (reference, item) => {
        // 屏蔽主操作
        reference.setState({
            $forbidden: true,    // 禁止屏幕主操作
            $popover: item.key,  // 打开 Popover
        });
    }
}