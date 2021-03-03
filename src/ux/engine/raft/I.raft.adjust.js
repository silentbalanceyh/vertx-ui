const adjustTitle = (cell = {}) => {
    if (cell.title) {
        if (cell.optionItem) delete cell.optionItem;
        if (cell.optionConfig) delete cell.optionConfig;
        if (cell.optionJsx) delete cell.optionJsx;
        if (cell.render) delete cell.render;
        if (!cell.className) cell.className = "ux-title";
        delete cell.col;
        if (!cell.span) cell.span = 24;
    }
};
const adjustButton = (cell = {}) => {
    if ("$button" === cell.field) {
        if (!cell.optionJsx || !cell.col) {
            console.error(cell);
            throw new Error('[ Ux ] 这里不可能没有 optionJsx 或 col 属性');
        }
        if (cell.hidden) {
            /*
             * 如果隐藏直接设置 optionItem 中的内容，清空
             * 隐藏的优先级最高，可占用全行处理
             * 这种情况下，设置可以不生效，因为已经隐藏 hidden = true
             */
            if (!cell.optionItem) cell.optionItem = {};
            cell.optionItem.labelCol = {span: 0};
            cell.optionItem.wrapperCol = {span: 24};
        } else {
            /*
             * 不隐藏时先清空分号（ label 旁边那个分号不需要 ）
             * 然后根据配置来执行按钮的对齐处理
             * 1）纯左对齐
             * 2）和 label 之后的输入对齐（标准表单）
             * 3）居中处理（登录表单专用）
             */
            const {align} = cell.optionJsx;
            if (!cell.optionItem) cell.optionItem = {};
            cell.optionItem.colon = false;
            if (align) {
                /*
                 * 然后为按钮中的列注入 style
                 */
                if (cell.col.style) cell.col.style = {};
                if ("center" === align || "left" === align || "right" === align) {
                    /*
                     * 这种模式下，先清空展开成全行
                     */
                    cell.optionItem.labelCol = {span: 0};
                    cell.optionItem.wrapperCol = {span: 24};
                    /*
                     * 三种 html 中常用的对齐模式
                     */
                    cell.col.style.textAlign = align;
                } else {
                    // TODO: 其他模式
                }
            } else {
                /*
                 * 没有配置或者无值的时候，使用第二种标准表单
                 * 1）这种模式下部管宽度
                 * 2）按钮需要配置解析器，如：
                 *    $metadata: "$button,,14"
                 * 3）通过这种模式设置 span
                 */
                cell.optionItem.label = " ";
            }
        }
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    adjustTitle,
    adjustButton,
}