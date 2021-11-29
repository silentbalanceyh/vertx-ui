import Ux from "ux";

/**
 * ## 登录专用类
 *
 * ### 1. 基本说明
 *
 * 登录专用类，用于渲染 username / password，注入键盘事件
 *
 * * 给 `username` 和 `password` 设置键盘事件。
 * * 在输入过程中，使用回车触发提交操作。
 *
 * ### 2. 调用代码示例
 *
 * ```js
 * // 非法处理
 * const login = new Login();
 *
 * // 合法处理（框架内部代码）
 * import Ux from 'ex';
 * import Ex from 'ex';
 *
 * &#64;Ux.zero(Ux.rxEtat(require('./Cab.json'))
 *      .cab("ExLogin")
 *      .form().raft(1).raft(Ex.Jsx.Login)
 *      .bind(Ex.Op)
 *      .to()
 * )
 * ```
 *
 * ### 3. 特殊说明
 *
 * * 触发按钮的ID为`$opLogin`，该ID为特定ID。
 *
 */

export default {
    /**
     * @class Login
     */
    Login: {
        /**
         * 渲染用户名，在Jsx中注入`onPressEnter`事件
         *
         * @param {ReactComponent} reference React对应组件引用。
         * @param {Object} jsx 输入的jsx配置。
         * @returns {Jsx}
         */
        username: (reference, jsx) => {
            jsx.onPressEnter = (event) => {
                Ux.prevent(event);
                Ux.connectId("$opLogin");
            };
            return Ux.aiInput(reference, jsx);
        },
        /**
         * 渲染密码，在Jsx中注入`onPressEnter`事件
         *
         * @param {ReactComponent} reference React对应组件引用。
         * @param {Object} jsx 输入的jsx配置。
         * @returns {Jsx}
         */
        password: (reference, jsx) => {
            jsx.onPressEnter = (event) => {
                Ux.prevent(event);
                Ux.connectId("$opLogin");
            };
            return Ux.aiInput(reference, jsx);
        }
    },
    Address: {
        /*
         * 常用地址选择（带Linker）
         */
        regionId: (reference, jsx) => {
            const onChange = (selected, options) => {
                // 1.构造Form专用数据
                const data = {};
                // 城市数据提取
                const countryId = selected[0];
                const country = Ux.elementUnique(options, "value", countryId);
                if (country) {
                    data.country = country.label;
                    // 省会
                    const stateId = selected[1];
                    const state = Ux.elementUnique(country.children, "value", stateId);
                    if (state) {
                        data.state = state.label;
                        // 城市
                        const cityId = selected[2];
                        const city = Ux.elementUnique(state.children, "value", cityId);
                        if (city) {
                            data.city = city.label;
                            // 区域
                            const regionId = selected[3];
                            const region = Ux.elementUnique(city.children, "value", regionId);
                            if (region) {
                                data.region = region.label;
                            }
                        }
                    }
                    Ux.formHits(reference, data);
                } else {
                    Ux.formHits(reference, {
                        country: undefined,
                        state: undefined,
                        city: undefined,
                        region: undefined,
                    })
                }
            };
            return Ux.aiAddressSelector(reference, jsx, onChange)
        }
    }
}