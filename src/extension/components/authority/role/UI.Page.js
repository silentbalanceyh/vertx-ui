import React from 'react'
import {Col, Empty, List, Row, Tree} from 'antd';
import Op from './op';
import Ux from 'ux';
import Ex from "ex";
import Rdr from './Web.Render';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Page")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPSetPage(this);
    }

    render() {

        return Ex.yoRender(this, () => {
            const {
                $heightStyle = {},
                $selectedData = []
            } = this.props;

            const title = Ux.fromHoc(this, "title");
            const treeAttrs = Op.yoPSetTree(this);
            return (
                <div className={"web-authority-control"}>
                    <Row>
                        <Col span={8}>
                            <div className={"ux-title-fix ux-title-pure"}>
                                {title['permSet']}
                            </div>
                        </Col>
                        <Col span={16}>
                            <div className={"ux-title-fix ux-title-pure"}>
                                {title['permission']}
                            </div>
                        </Col>
                    </Row>
                    <Row className={"perm-row"}>
                        <Col span={8} {...$heightStyle} className={"data-tree"}>
                            <Tree {...treeAttrs}/>
                        </Col>
                        <Col span={16} {...$heightStyle} className={"data-list"}>
                            {0 < $selectedData.length ? ((() => {
                                const iconMap = Ux.fromHoc(this, "icon");
                                const source = $selectedData.sort(Ux.sorterAscFn('code'))
                                return (
                                    <List dataSource={source}
                                          renderItem={Rdr.renderCard(this, iconMap)}/>
                                )
                            })()) : (
                                <Empty description={title['permEmpty']}/>
                            )}
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("PxAuthority-Role").control())
    }
}

export default Component