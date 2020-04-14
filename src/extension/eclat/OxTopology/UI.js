import React from 'react';
import Yo from './yo';
import Ex from 'ex';
import Ux from 'ux';
import {Col, Row} from 'antd';
import renderOption from './Web.Option';
import renderWithTpl from './Web.Tpl';
import renderDialog from './Web.Dialog';
/* 内容渲染 */
import OxCi from '../OxCi/UI';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExTopology")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Yo.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Yo.yuPage(this, {props: prevProps, state: prevState});
    }

    render() {
        return (
            <div className={"drawer-background"}>
                {renderOption(this)}
                {renderDialog(this, (inherit) => (<OxCi {...inherit}/>))}
                <Row>
                    <Col span={24}>
                        {Ex.yoRender(this, () => renderWithTpl(this),
                            Ex.parserOfColor("OxTopology").component())}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Component;