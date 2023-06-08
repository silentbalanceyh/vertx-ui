import React from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {App, ConfigProvider} from 'antd';
import {BrowserRouter} from "react-router-dom";

import routes from "./environment/routes";
import storeGlobal from "./environment/store";


import './style/index.scss';
import Sk from 'skin';
/**
 * 新定义系统中所需的所有类型
 *
 * @typedef JObject 从Json文件中读取的JsonObject，一般和资源文件中的 JsonObject 绑定。
 * @typedef EmptyActionCreator redux-act 的返回值，特殊场景会使用。
 * @typedef ReactComponent React组件引用，通常是 reference。
 * @typedef WebColor 值为 #XXXXXX 的Web颜色值（字符串格式）。
 * @typedef Ux 全局工具类，核心调用入口
 */
/**
 * @overview
 *
 * # Zero UI框架API文档
 *
 * 版本重构之后，`node` 可以使用 `20.x+` 的版本运行此框架，从2018年框架诞生开始，整个框架经历了很多改动，2023年一月经历了最大规模的升级，之后所有新规范都参考 [《Zero云平台白皮书》](http://www.vertx-cloud.cn/document/doc-web/index.html) 执行标准化开发。API文档中包括：
 *
 * 1. 包括 `Ux/Ex` 部分所有的文档（注释生成）以及代码示例。
 * 2. 详细的原理文档、图示、代码规范参考 [《Zero云平台白皮书》](http://www.vertx-cloud.cn/document/doc-web/index.html) 中的说明。
 *
 * ## 1. 框架结构
 *
 * ### 1.1. 模块化
 *
 * 参考：[7.1.1.模块化](http://www.vertx-cloud.cn/document/doc-web/index.html#_%E6%A8%A1%E5%9D%97%E5%8C%96)
 *
 * 前端模块化的详细信息参考上述链接可了解详情，最新版本已经将内容分为：**自定义模块、外部模块、内部模块** 三种。
 *
 * 1. **自定义模块**：每个应用的自定义模块有所不同，为开发人员为项目定制的专用模块。
 * 2. **外部模块**：您可理解成Zero UI的前端 SDK，开发人员可以使用外部模块中人任何功能帮助快速开发。
 * 3. **内部模块**：（**禁止**）开发人员直接使用的模块，只能使用 `Ux/Ex` 的 API 执行调用。
 *
 * ### 1.2. 开发专用
 *
 * * `ux / ex`：「函数」Zero UI核心模块和Zero Extension模块专用API，开发人员可以通过 `import Ux from 'ux';` 和 `import Ex from `ex`;` 来引入和使用（高频模块）。
 * * `web / ei / oi`：「组件」可使用的Zero UI中提供的三种组件：
 *      * `web`：标准组件，多为交互式组件，用于表单渲染和自定义组件开发。
 *      * `ei`：扩展组件，多为带业务信息的可重用组件，复杂度根据业务场景而有所区别。
 *      * `oi`：配置组件，数据驱动和配置驱动时前端专用的可配的组件信息（只能配置，开发中禁止直接调用）。
 * * `ui`：针对 List / Form 两种复杂组件的智能化开发包，可将配置数据压缩到 15% 左右。
 * * `mock / plugin`：自定义组件中的插件开发和测试模拟数据接口开发，可开启框架的模拟环境。
 *
 * ## 2. 文档站点
 *
 * 新版文档服务器直接使用 AsciiDoc 书写主文档，而使用 JsDoc 书写 Ux 和 Ex 部分的文档，链接在首页，可直接点击进入，不再分离文档，环境配置参考如下步骤：
 *
 * ### 2.1. 基本环境
 *
 * ```shell
 * # 新版使用 yarn 替代了 npm，所以安装可使用新方式
 * yarn add docdash --dev
 * # 旧：npm install docdash
 *
 * # 如果缺乏 jsdoc，则直接运行
 * yarn add jsdoc --dev
 * # 旧：npm install jsdoc
 * ```
 *
 * 由于项目中本身不存在上述的 dependency 的第三方依赖包，您可以直接安装，也可以加上`-g`参数安装在全局环境中，安装完成后，直接执行根目录下的 `run-doc.sh` 脚本生成相关文档。
 *
 * 如果您要使用文档服务器，先在机器上安装`live-server`（建议使用全局模式）：
 *
 * ```shell
 * yarn global add live-server
 * # 旧：npm install live-server -g
 * ```
 *
 * ### 2.2. 运行服务器
 *
 * 安装完成后，直接执行根目录下的 `/run-doc.sh` 脚本则可执行文档服务器。
 *
 * |命令执行|参数名|含义|
 * |---:|:---|:---|
 * |`./run-doc.sh doc`|doc|生成所有文档。|
 * |`./run-doc.sh server`|server|启动文档服务器。|
 *
 * ```shell
 * // 生成 Zero UI/Extension 文档
 * ./run-doc.sh doc
 *
 * // 运行文档服务器
 * ./run-doc.sh server
 * ```
 *
 * ### 2.3. 书写规则
 *
 * #### 2.3.1. 标记
 *
 * 如果有特殊函数，整个文档会使用加粗的方式标记该函数，主要标记如下：
 *
 * * 「标准」JavaScript标准封装函数（脱离Zero Ui可使用）。
 * * 「引擎」Zero Ui中的核心层函数，提高开发效率专用。
 * * 「类」Zero Ui中定义的核心类函数。
 * * 「私有」内部函数，不对外提供API，不可使用`Ux.xxx`方式调用，私有部分可能不会生成文档。
 *
 * #### 2.3.2. 关于组件
 *
 * 由于组件本身使用的是 React 旧版本的 class 定义模式，而这种定义模式若使用 `@class` 文档标记，会导致左侧的目录无法放在 `@module` 内部，所以此处不再使用 `@class` 标记组件，而直接使用 `@method` 标记，这种方式也契合 Function As Component 的新版思路。
 *
 * ## 3. 未开放API表
 *
 * 未开放API表满足条件：
 *
 * - 模块对外本身已开放，内部模块也在调用。
 * - `Ux` 中不包含该函数且没有对接。
 *
 * ### zone
 *
 * |文件|函数名|
 * |:---|:---|
 * |`zone/fn.assemble.amb.form.js`|`ambFormSubmit`|
 * ||`ambFormEnd`|
 * |`zone/fn.assemble.amb.polysemy.js`|`ambFn` |
 * |`zone/fn.under.is.decision.js`|`isNull`|
 * ||`isNodeList`|
 * |`zone/fn.under.way.io.js`|`wayJ2S`|
 * ||`wayA2S`|
 * ||`wayO2S`|
 * ||`wayS2J`|
 * |`zone/fn.debug.dg.develop.js`|`dgUCA`|
 * |`zone/fn.web.compile.store.js`|`compilePutO`|
 * ||`compilePut`|
 * ||`compileGetO`|
 * ||`compileGet`|
 * ||`compileRemove`|
 * ||`compileClear`|
 * |`zone/fn.web.connect.event.js`|`connectIdFn`|
 * |`zodiac/antd4.fn.v4.patch.js`|`v4FormHidden`|
 * ||`v4FormRef`|
 * |`zodiac/antd4.fn.v4.patch.form.js`|`v4InputItem`|
 * ||`v4InputJsx`|
 * ||`v4InputEvent`|
 * ||`v4InputDepend`|
 * |`zodiac/lkway.fn.on.under.prop.js`| `onProp` |
 * |`zodiac/lkway.fn.yo.under.prop.js`| `yoDatum` |
 * ||`yoChild`|
 * |`zodiac/source.datum.fn.parse.data.js`| `parseOrigin` |
 * |`zion/annotation.fn.anno.util.js`|`annoConnect`|
 * ||`annoI18n`|
 * ||`annoI18nName`|
 * ||`annoError`|
 * ||`annoFailed`|
 * |`zion/redux.fn.is.fixbug.js`|`isLoading`|
 * |`zion/uca.fn.xt.economy.dialog.js`|`xtDialogCombine`|
 * ||`xtDialogConfig`|
 * ||`xtDialogClick`|
 * |`zion/uca.fn.xt.economy.search.js`|`xtSearchConfig`|
 * |`zion/uca.fn.xt.economy.table.js`|`xtTableConfig`|
 * ||`xtTablePager`|
 * |`zion/verify.fn.valve.validator.js`|`valveValidator`|
 * |`zest@web/equip.fn.width.calculate.js`|`widthSeed`|
 * ||`widthTitle`|
 *
 * 如果您有什么疑问，请联系：[silentbalanceyh@126.com](mailto:silentbalanceyh@126.com)，整体框架相关链接参考左侧菜单。
 * @author 戒子猪
 */
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <ConfigProvider {...Sk.skinDefaultProvider()}>
        <App>
            <Provider store={storeGlobal}>
                <BrowserRouter store={storeGlobal}>
                    {routes}
                </BrowserRouter>
            </Provider>
        </App>
    </ConfigProvider>
)
