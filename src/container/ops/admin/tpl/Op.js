import {Of} from 'app';
import {Dsl} from 'entity';
import Ux from 'ux';
import Ex from "ex";

const yiLayout = (reference) => {
    const props = reference.props;
    if (props.hasOwnProperty("$collapsed")) {
        const {$collapsed = true} = props;
        reference.setState({$collapsed, $ready: true});
    }
};
const yiSider = (reference) => {
    const {$identifier} = reference.props;
    if ($identifier) {
        reference.setState({$loading: true});
        Dsl.of(reference).bind(Of.apiMenuSub).ok(response => {
            const $data = Ux.Uarr.create(Ux.isArray(response) ? response : [])
                .map(item => Ex.mapUri(item, undefined))
                .add("className", "ux-invert")
                .tree({sort: "order"})
                .to();
            const state = {$data, $loading: false};
            Ux.toPid(reference, response, state);
            state.$ready = true;
            reference.setState(state);
            /* $navSource */
            const ref = Ux.onReference(reference, 1);
            if (ref) {
                ref.setState({$navSource: response});
            }
        }).async({key: $identifier})
    }
}
const yuSider = (reference, virtualRef) => {
    const current = reference.props.$identifier;
    const previous = virtualRef.props.$identifier;
    if (current !== previous) {
        yiSider(reference);
    }
}
const yiTenant = (reference) => {
    const state = {};
    Dsl.of(reference).bind(Of.apiTenant).ok(response => {
        state.$options = response;
        state.$ready = true;
        reference.setState(state);
    }).async();
}
const rxTenant = (reference) => (item) => {
    // TODO: 修改租户信息
    Ux.dgTodo({item}, "/container/ops/admin/tpl/Op.js, 选择租户：")
}
const yoNavs = (reference, $nav = []) => {
    const pages = Ux.fromHoc(reference, "pages");
    const $navigation = Ux.clone($nav);
    if (3 === $nav.length) {
        const parent = $nav[$nav.length - 1];
        const item = Ux.elementUnique(pages, 'parentId', parent.key);
        if (item) {
            const {$router} = reference.props;
            const current = $router.path();
            if (current.endsWith(item.uri)) {
                $navigation.push(item);
            }
        }
    }
    return $navigation;
}
const rxMenu = (reference) => ({item}) => {
    const {data = {}} = item.props;
    const uri = data.data ? data.data.uri : undefined;
    if (uri) {
        const {$router} = reference.props;
        if ($router) {
            const selected = Ux.toQuery("mid");
            /*
             * 一二级菜单点击，激活效果
             */
            let target = uri;
            if (selected) {
                target += `?mid=${selected}&pid=${data.key}`;
            }
            $router.to(target);
        }
    }
    const ref = Ux.onReference(reference, 1);
    if (ref) {
        ref.setState({$navLeft: data.data})
    }
}
export default {
    rxTenant,
    rxMenu,
    yiTenant,
    yiLayout,
    yiSider,
    yuSider,
    yoNavs,
}