import React from 'react'
import './Cab.less';
import Bg from './image/bg.jpg';
import Ux from 'ux';
import {Layout} from 'antd'

const {Header, Content} = Layout;

class Component extends React.PureComponent {

    render() {
        const {component: Component} = this.props;
        return (
            <Layout className={"login"} style={{
                backgroundImage: `url(${Bg})`
            }}>
                <Header className={"login-header"}/>
                <Content className={"login-content"}>
                    {Ux.uiGrid([8, 8, 8],
                        undefined,
                        <Component {...this.props}/>
                    )}
                </Content>
            </Layout>
        )
    }
}

export default Component;
