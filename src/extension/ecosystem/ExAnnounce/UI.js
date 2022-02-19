import React from 'react';
import renderHTML from 'react-render-html';
import './Cab.less';
import Ux from "ux";
import Ex from 'ex';

import {Button, Card, Carousel, Empty} from 'antd'

const componentInit = (reference) => {
    Ux.ajaxGet("/api/x-notice/by/sigma", {}).then(response => {
        const state = {};
        state.$ready = true;
        state.$data = response;
        reference.setState(state);
    })
}

const renderNotice = (reference, data = []) => {
    return (
        <Carousel>
            {data.map(item => (
                <div key={item.key} className={"ex-content"}>
                    <div className={"action"}>
                        <Button.Group size={"small"}>
                            <Button icon={"search"}/>
                            <Button icon={"link"} className={"ux-spec"}/>
                        </Button.Group>
                    </div>
                    <Card.Meta title={item.name}
                               description={(
                                   <div>
                                       {renderHTML(item.content)}
                                   </div>
                               )}/>
                </div>
            ))}
        </Carousel>
    )
}

class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {config = {}} = this.props;
            const {$data = []} = this.state;
            return (
                <Card title={config.title}
                      className={`${Ux.Env.ECONOMY.CARD_CONTAINER} ex-announce`}>
                    {(() => {
                        if (0 === $data.length) {
                            return (
                                <Empty/>
                            )
                        } else {
                            return renderNotice(this, $data);
                        }
                    })()}
                </Card>
            )
        }, Ex.parserOfColor("ExAnnounce").control())
    }
}

export default Component