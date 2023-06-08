import __Zn from '../zero.uca.dependency';

export default {
    yiExtra: ($tabs = {}, reference) => {
        const {
            extraContent,
            extraConfig = {}
        } = $tabs;
        /*
         * 旧版本：tabBarExtraContent（用于aiDialogEditor专用）
         * 新版本：extraContent（非DialogEditor时需使用）
         */
        if (extraContent) {
            const {
                $renders = {},
                $inited = {}
            } = reference.props;

            $tabs.fnExtra = (activeKey) => {
                const configuration = {
                    ...extraConfig,
                    activeKey,
                }
                // extraContent 两种模式
                if ("string" === typeof extraContent) {
                    const renderJsx = $renders[extraContent];
                    if (__Zn.isFunction(renderJsx)) {
                        return renderJsx($inited, configuration, reference);
                    }
                } else if (__Zn.isArray(extraContent)) {
                    configuration.className = "uca_FieldContainer_Drawer"
                    return __Zn.aiTabExtra(reference, {
                        items: extraContent,
                        config: configuration,
                        data: $inited,
                    });
                } else {
                    console.error("extraContent 配置错误", extraContent);
                }
            }
            // 必须删除
            delete $tabs.extraContent;
            if (extraConfig) delete $tabs['extraConfig'];
        }
    }
}