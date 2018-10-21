import React from 'react';
import NoImage from './image/no-image.jpg';
import './Cab.less';
import Op from './Op';
import {Avatar, Modal} from 'antd';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            src: undefined,
            $visible: false
        };
    }

    componentDidMount() {
        Op.loadImage(this);
    }

    render() {
        let {src, $visible = false} = this.state;
        const {style = {}, config = {}, params = {}} = this.props;
        if (!src) src = NoImage;
        const dialog = {};
        dialog.onOk = () => this.setState({$visible: false});
        dialog.onCancel = () => this.setState({$visible: false});
        dialog.maskClosable = false;
        dialog.destroyOnClose = true;
        dialog.title = params.name ? params.name : "None";
        return (
            <div>
                <Avatar src={src} shape={"square"} icon={"picture"} alt={"Download"}
                        style={style}
                        onClick={() => this.setState({$visible: true})}
                        className={"web-loading-image"}/>
                {config.meta && config.meta.dialog ? (
                    <Modal visible={$visible}
                           width={config.meta.width + 40}
                           {...dialog}>
                        <img src={src} alt={"Preview"} style={{
                            width: config.meta.width,
                            height: config.meta.height,
                        }}/>
                    </Modal>
                ) : false}
            </div>
        );
    }
}

export default Component;