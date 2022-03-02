import React from 'react';
import Ux from 'ux';
import {Spin} from 'antd';

const componentInit = (reference, data) => {
    Ux.parallel(data.map(file => {
        return Ux.ajaxDownload(file['fileUrl']);
    })).then(downloaded => {
        const promises = [];
        data.forEach((each, index) =>
            promises.push(Ux.asyncImage(each, downloaded[index])));
        return Ux.parallel(promises)
    }).then(item => {
        const file = item[0];
        const state = {};
        if (file) {
            state.$imageUrl = file.thumbUrl;
        }
        state.$loading = false;
        state.$fileKey = file['fileKey'];
        reference.setState(state);
    })
}

class Component extends React.PureComponent {
    state = {}

    componentDidMount() {
        const {data} = this.props;
        if (Ux.isArray(data)) {
            componentInit(this, data);
        } else {
            const state = {};
            state.$loading = false;
            state.$imageUrl = data;
            this.setState(state);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {data = []} = this.props;
        if (Ux.isArray(data)) {
            const {$fileKey} = this.state;
            const file = data[0] ? data[0] : null;
            if (file && file['fileKey'] !== $fileKey) {
                this.setState({$loading: true});
                componentInit(this, data);
            }
        }
    }

    render() {
        const {$loading = true, $imageUrl} = this.state;
        const {$logoCss = {}} = this.props;
        return (
            <Spin spinning={$loading}>
                <img src={$imageUrl} alt={"LOGO"} style={$logoCss}/>
            </Spin>
        )
    }
}

export default Component