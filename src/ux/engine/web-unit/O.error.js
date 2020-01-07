import './Cab.less';
import React from 'react';

const aiFloatError = (reference, condition = true) => {
    const field = reference.props['data-__field'];
    if (condition) {
        if (field.errors && 0 < field.errors.length) {
            const error = field.errors[0];
            if (error) {
                const message = error.message;
                if (message) {
                    return (
                        <div className={"web-error"}>
                            {message}
                        </div>
                    )
                } else {
                    /*
                     * 未配置 message
                     */
                    console.error("[ Xt ] Error：未配置 message 节点，验证问题！", error);
                    return false;
                }
            } else {
                /*
                 * 错误提取失败
                 */
                return false;
            }
        } else {
            /*
             * 验证无错
             */
            return false;
        }
    } else {
        /*
         * 外置条件不满足
         */
        return false;
    }
};

export default {
    aiFloatError,
}