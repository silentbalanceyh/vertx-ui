import React from 'react'
import './Cab.less'
import Ux from 'ux';
import {Card, Col, Icon, List, Row} from 'antd';
import {Link} from 'react-router-dom';
import Op from './Op';

const {zero} = Ux;

const renderPanel = (panel = []) => (panel.map(item => {
    const {title, children = []} = item;
    return (
        <Card key={item.key} title={title}
              className={"zero-half-card"}
              extra={item.icon ? (
                  <Icon {...item.icon}/>
              ) : false}>
            <List bordered={false}
                  dataSource={children.filter(each => !!each.uri)}
                  className={"zero-list"}
                  renderItem={each => (
                      <List.Item key={each.key}>
                          <Row style={{width: "100%"}}>
                              <Col span={23}>
                                  <Link to={each.uri} style={{
                                      color: each.color
                                  }}>
                                      {each.title}
                                  </Link>
                              </Col>
                              <Col span={1}>
                                  {each.finished ? (
                                      <Icon type="check" style={{
                                          color: "#52c41a"
                                      }}/>
                                  ) : (
                                      <Icon type="exclamation" style={{
                                          color: "#eb2f96"
                                      }}/>
                                  )}
                              </Col>
                          </Row>
                      </List.Item>
                  )}/>
        </Card>
    )
}));

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab('UI.Page.Guide')
    .to()
)
class Component extends React.PureComponent {
    render() {
        const treeData = Op.analyzeTree(this);
        const leftPanel = treeData.filter((item, index) => 0 === index % 2);
        const rightPanel = treeData.filter((item, index) => 0 !== index % 2);
        return (
            Ux.aiGrid([
                    "span=12,className=zero-range",
                    "span=12,className=zero-range"
                ],
                renderPanel(leftPanel),
                renderPanel(rightPanel)
            )
        )
    }
}

export default Component