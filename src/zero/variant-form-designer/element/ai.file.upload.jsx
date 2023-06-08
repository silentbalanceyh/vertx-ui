import React from 'react';
import Sd from './ai.__.fn.shared';
import {uca} from 'zi';

@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "aiFileUpload",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Sd.yiComponent(this, {
            id: "SubForm-Setting-aiFileUpload",
            renders: {
                uploadUpApi: Sd.yoRenders.uploadUpApi,
                uploadDownApi: Sd.yoRenders.uploadDownApi,
                uploadUpParam: Sd.yoRenders.uploadUpParam,
            }
        });
    }

    render() {
        const {$inited = {}} = this.props;
        return Sd.yoComponent(this, $inited);
    }
}

export default Component