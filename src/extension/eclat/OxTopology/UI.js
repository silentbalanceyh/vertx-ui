import React from 'react';
import Yo from './Op';
import Ex from 'ex';
import Ux from 'ux';
import {Col, Row} from 'antd';
/* 内容渲染 */
import {LoadingAlert} from "web";
import {ExGraphicViewer} from "ei";

/**
 * ## 「组件」`OxTopology`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|Ok|
 *
 * @memberOf module:web-component
 * @method OxTopology
 */
// =====================================================
// componentInit/componentUp
// =====================================================

const toCriteria = (reference) => {
    const {$inited = {}} = reference.props;
    const user = Ux.isLogged();
    const category3 = Ux.elementUniqueDatum(reference, "data.category", "key", $inited.categoryThird);
    const category2 = Ux.elementUniqueDatum(reference, "data.category", "key", $inited.categorySecond);
    const criteria = {
        "": true,
        "$0": {
            ownerId: user.key,
            "": false,
            "ownerId,n": true
        }
    };
    if (category2 && category3) {
        criteria['modelId,i'] = [
            category2.identifier,
            category3.identifier,
        ]
    }
    return criteria;
};

const toDialog = (reference) => {
    const {config = {}} = reference.props;
    const {$dialog} = config;
    if ($dialog) {
        const dialog = Ux.configDialog(reference, $dialog.window);
        const button = $dialog.button;
        return {dialog, button};
    }
}
/*
 * 先 level = 2 的方式读取
 * - 如果数据量超过 60，则再读取一次 level = 1
 * - 如果数据量不超过 60，则以本次结果为主
 */

const toData = (processed = {}, key) => {
    return Ux.ajaxGet("/api/graphic/analyze/:key?level=2", {key}).then(response => {
        const {nodes = []} = response;
        if (60 < nodes.length) {
            /*
             * 这里的理论值一定不会超过 60 个节点，超过 60 个节点就需要检查当前环境中的关系设置了。
             */
            return Ux.ajaxGet("/api/graphic/analyze/:key?level=1", {key});
        } else return Ux.promise(response);
    })
}

const componentInit = (reference) => {
    const state = {};
    Ex.yiStandard(reference, state).then(processed => {
        const {$inited = {}} = reference.props;
        const key = $inited.globalId;

        /* 窗口专用配置 */
        const $dialog = toDialog(reference);
        if ($dialog) {
            processed.$dialog = $dialog;
        }

        /* 读取节点信息 */
        return toData(processed, key).then(response => {
            /* 当前节点高亮 */
            const {nodes = []} = response;
            nodes.forEach(node => {
                if (key === node.key) {
                    node.attrs = {
                        // 新版数据结构
                        body: {
                            fill: "#FFEC8B"
                        }
                    }
                }
            });
            /* 还超过60个的情况，置空，无法绘制 */
            if (60 < nodes.length) {
                processed.$data = {nodes: [], edges: []};
            }
            /*
            * 拓扑图数据信息
            * $tplData - 原始数据信息（包含了当前节点对应的所有数据）
            * $data - 运行时可改变的数据信息
            * */
            // processed.$tplData = response;
            processed.$data = response;
            return Ux.promise(processed);
        }).then(processed => Ux.ajaxPost('/api/graphic/search', {
            criteria: toCriteria(reference)
        }).then((definition = {}) => {
            /* 图模板相关信息 */
            const {list = []} = definition;
            const $tpl = Ux.clone(list);
            $tpl.filter(item => !item.value).forEach(item => item.value = item.key);
            processed.$tpl = $tpl;
            /* 核心模板数据信息 */
            // processed.$tplData = processed.$data;
            return Ux.promise(processed);
        })).then(Ux.ready).then(Ux.pipe(reference));
    })
}
const componentUp = (reference, virtualRef) => {
    const previous = virtualRef.props.$inited;
    const current = reference.props.$inited;
    if (previous && current) {
        /*
         * 条件变化
         * up / down
         */
        if (Ux.isArray(previous.up) && Ux.isArray(current.up)) {
            if (current.up.length !== previous.up.length
                && Ux.isDiff(current.up, previous.up)) {
                /*
                 * up 条件变化
                 */
                reference.setState({$ready: false});
                componentInit(reference);
            }
        }
        if (Ux.isArray(previous.down) && Ux.isArray(current.down)) {
            if (current.down.length !== previous.down.length
                && Ux.isDiff(current.down, previous.down)) {
                /*
                 * down 条件变化
                 */
                reference.setState({$ready: false});
                componentInit(reference);
            }
        }
    }
}

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExTopology")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {props: prevProps, state: prevState});
    }

    render() {
        return Ex.yoRender(this, () => (
            <div className={"drawer-background"}>
                <Row>
                    <Col span={24}>
                        {Ex.yoRender(this, () => {
                            const {$data = {}} = this.state;
                            const {nodes = []} = $data;
                            if (0 < nodes.length) {
                                const inherit = Ex.yoAmbient(this);
                                /*
                                 * 处理图配置
                                 */
                                Yo.yoGraphic(inherit, this);
                                inherit.data = $data;
                                /*
                                 * 事件构造
                                 */
                                const gxFun = Yo.rxCommand(this);
                                return (
                                    <ExGraphicViewer {...inherit}
                                                     {...gxFun}/>
                                );
                            } else {
                                const alert = Ux.fromHoc(this, "alert");
                                return (
                                    <LoadingAlert $alert={alert}/>
                                )
                            }
                        }, Ex.parserOfColor("OxTopology").component())}
                    </Col>
                </Row>
            </div>
        ), Ex.parserOfColor('OxTopology').component())
    }
}

export default Component;