import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import {Col, Row} from 'antd';
import {Fn} from 'app';
import jsx from './jsx';
import './Cab.less';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const title = Ux.fromHoc(this, "title");
            return (
                <div className={"ops-tag-category"}>
                    <Row>
                        <Col span={6} className={"range"}>
                            {Fn.jsxCard(this,
                                () => jsx.renderTree(this),
                                null,
                                () => title.tree,
                            )}
                        </Col>
                        <Col span={18}>
                            <Row>
                                <Col span={8} className={"range"}>
                                    {Fn.jsxCard(this,
                                        () => jsx.renderInfo(this),
                                        null,
                                        () => title.basic,
                                    )}
                                </Col>
                                <Col span={16} className={"range"}>
                                    {Fn.jsxCard(this,
                                        () => jsx.renderReport(this),
                                        null,
                                        () => title.percent,
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} className={"range"}>
                                    {Fn.jsxCard(this,
                                        () => jsx.renderTable(this),
                                        null)}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("PxTagCategory").page())
    }
}

export default Component