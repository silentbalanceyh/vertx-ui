// 导入外层
import Ut from '../../unity';

export default (reference, item) => {
    if (item.field) {
        if (item.optionConfig && item.optionConfig.hasOwnProperty("rules")) {
            if (!item.optionJsx) item.optionJsx = {};
            // onFocus
            item.optionJsx.onFocus = Ut.htmlErrorFocus(item);
            // onBlur
            item.optionJsx.onBlur = Ut.htmlErrorBlur(item);
        }
    }
}