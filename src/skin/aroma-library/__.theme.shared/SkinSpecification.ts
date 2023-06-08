interface SkinSpecification {
    // ConfigProvider
    config_provider(): Object;

    // ProLayout
    config_token(setting: any): Object;
}

export default SkinSpecification;

export const withEnv = (envRef: any) => {
    if (!envRef) {
        return {};
    }
    const cssColor = envRef.CSS_COLOR;
    const cssFont = Number(envRef.CSS_FONT);
    const token: any = {};
    token.colorPrimary = cssColor;
    if (!isNaN(cssFont)) {
        token.fontSize = cssFont;
    }
    // 默认圆角，来自环境变量
    const radius = process.env.CSS_RADIUS;
    if (radius) {
        token.borderRadius = parseFloat(radius);
    }
    return token;
}