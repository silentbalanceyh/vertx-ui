import React from 'react'
import './Cab.less'
import Ux from 'ux';
import {Card, Icon, List} from 'antd';
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
                          <Link to={each.uri} style={{
                              color: each.color
                          }}>
                              {each.title}
                          </Link>
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