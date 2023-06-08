import __LOCALE from './wait._.v.locale.definition';
import __SKIN from './aroma-library';

const __i18Region = () => {
    const code = process.env.LANGUAGE;
    return __LOCALE[code] ? __LOCALE[code] : __LOCALE.cn;
}

const __iSkinSpec = () => {
    const module = process.env.CSS_SKIN_MODULE;
    const name = process.env.CSS_SKIN_NAME;
    if (__SKIN) {
        const moduleCls = __SKIN[module];
        if (moduleCls) {
            return new moduleCls[name](process.env);
        }
    }
}
/*
 * 风格文件处理，根据环境变量执行风格切换，整个风格包使用
 * import Sk from 'skin';
 * 环境变量
 * - Z_CSS_FONT            : 字体大小
 * - Z_CSS_COLOR           : 主色调
 * - Z_CSS_SKIN_MODULE     : 风格所属模块
 * - Z_CSS_SKIN_NAME       : 风格名称
 * - Z_LANGUAGE          : 语言包
 */
const skinDefaultProvider = () => {
    const attrs = {};
    attrs.locale = __i18Region();

    const skinSpec = __iSkinSpec();
    if (skinSpec) {
        const combine = skinSpec.config_provider();
        if (combine) {
            Object.assign(attrs, combine);
        }
    }
    return attrs;
}
const skinDefaultToken = (settings) => {
    const skinSpec = __iSkinSpec();
    if (skinSpec) {
        return skinSpec.config_token(settings);
    } else {
        return {};
    }
}
export default {
    skinDefaultProvider,
    skinDefaultToken,
    skinI18n: (jsx, key) => {
        if (!jsx.locale) {
            const localeData = __i18Region();
            if (localeData && localeData[key]) {
                jsx.locale = localeData[key];
            }
        }
    }
}