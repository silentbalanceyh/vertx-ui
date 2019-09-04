import pageHoc from './ox.page';
import controlHoc from './ox.control';
import Chn from '../channel';

const hoc = {
    "Page": pageHoc,
    "Control": controlHoc
};
export default (options = {}) => {
    if (!options.type) {
        throw new Error("[ Ox ] 对不起，渲染类型丢失！")
    }
    const pointer = hoc[options.type];
    return (target, property, descriptor) => {
        return class extends target {
            constructor(props) {
                super(props);
                this.state = {$ready: false}
            }

            async componentDidMount() {
                await pointer.yiThis(this);
            }

            render() {
                return Chn.yoRender(this, () => {
                    return super.render();
                }, options)
            }
        }
    }
}