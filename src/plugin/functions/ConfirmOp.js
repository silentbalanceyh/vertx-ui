import isLifeCycle from './isLifeCycle';

/*
 * 如果是
 * 1）三个参数，直接执行
 * 2）二个参数，直接执行
 * 相反
 * 如果是一个参数，返回一个函数，高阶
 */
function confirmOp() {
    if (1 === arguments.length) {
        /*
         * 返回二阶函数
         */
        return (record, reference) => confirmOp(record, reference, arguments[0])
    } else if (3 === arguments.length || 2 === arguments.length) {
        /*
         * 直接执行
         */
        const record = arguments[0];
        /*
         * 第二参和第三参
         */
        // eslint-disable-next-line
        const reference = arguments[1];
        // eslint-disable-next-line
        const ref = arguments[2];
        let calculated = {};
        const confirmStatus = record['confirmStatus'];
        if ("confirmed" === confirmStatus) {
            /*
             * 确认状态下，检查 lifecycle
             */
            const lifecycle = record.lifecycle;
            if (isLifeCycle(reference)) {
                if ("PENDING" === lifecycle || "READY" === lifecycle) {
                    /*
                     * PENDING, READY - 可编辑，可删除
                     */
                    calculated = {
                        edition: true,
                        deletion: true,
                    }
                } else if ("ONLINE" === lifecycle) {
                    /*
                     * ONLINE - 可编辑，不可删除
                     */
                    calculated = {
                        edition: true,
                        deletion: false,
                    }
                } else if ("OFFLINE" === lifecycle) {
                    /*
                     * OFFLINE - 可删除，不可编辑
                     */
                    calculated = {
                        edition: false,
                        deletion: true,
                    }
                } else {
                    /*
                     * INNER （只剩下INNER）
                     */
                    calculated = {
                        edition: true,
                        deletion: true,
                    }
                }
            } else {
                /*
                 * 不管，直接运算
                 */
                calculated = {
                    edition: true,
                    deletion: true,
                }
            }
        } else {
            /*
             * 未确认，直接不可编辑、不可删除
             * confirmStatus = unconfirmed
             */
            calculated = {
                edition: false,
                deletion: false,
            }
        }
        calculated.selection = (calculated.edition && calculated.deletion);
        return calculated;
    }
}

export default confirmOp