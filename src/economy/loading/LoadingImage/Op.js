import Ux from "ux";
import defaultImage from './image/no-image.jpg';

const loadImage = (reference = {}) => {
    const {config = {}, params = {}} = reference.props;
    if (0 === Object.keys(params).length) {
        // 无值不加载
        reference.setState({src: defaultImage});
    } else {
        // 有值才执行图片加载
        const link = Ux.formatExpr(config.ajax, params);
        Ux.ajaxDownload(link, params)
            .then(data => {
                const innerRder = new FileReader();
                const blob = new Blob([data], {
                    type: params.type ? params.type : "image/jpeg"
                });
                // 加载图片
                innerRder.readAsDataURL(blob);
                innerRder.addEventListener("load",
                    () => reference.setState({src: innerRder.result}));
            })
            .catch(errors => {
                const {data = {}} = errors;
                if (404 === data.status) {
                    reference.setState({src: defaultImage});
                }
            });
    }
};

export default {
    loadImage
};