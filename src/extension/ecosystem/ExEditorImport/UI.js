import React from 'react';
import Ex from 'ex';
import Op from './Op';
import Ux from 'ux';

import renderJsx from './Web.jsx';

class Component extends React.PureComponent {
    state = {
        $ready: false,
        $fileList: []
    };

    componentDidMount() {
        Op.yiEditor(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {
                $notice = {}, $upload = {}, $image,
                $button = {},
                $loading = false
            } = this.state;
            /*
             * 是否在加载，以及更改过的 $image 图片路径
             */
            $upload.loading = !!$loading;
            $upload.image = $image;
            return renderJsx(this, {
                notice: Ux.clone($notice),
                upload: Ux.clone($upload),
                // image: $image,
                button: $button,
            });
        }, Ex.parserOfColor("ExEditorImport").private());
    }
}

export default Component;