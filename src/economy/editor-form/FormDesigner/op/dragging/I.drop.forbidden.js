import Ux from 'ux';

export default {
    "aiTitle": (props, component) => {
        const {config = {}} = props;
        if (24 === config.span) {
            return true;
        } else {
            /* 不可执行 */
            const forbidden = Ux.fromHoc(component, "forbidden");
            const message = forbidden.aiTitle;
            if (message) {
                Ux.messageFailure(message);
            }
            return false;
        }
    }
}