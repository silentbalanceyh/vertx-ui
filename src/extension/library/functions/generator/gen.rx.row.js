import G from "../global";
import Ux from "ux";

const rxDelete = (reference) => (key) => {
    if (key) {
        const {options = {},$selected=[]} = G.state(reference);
        const uri = options[G.Opt.AJAX_DELETE_URI];
        return Ux.ajaxDelete(uri, {key})
            .then(()=>
            {
                const num=$selected.indexOf(key);
                //删除后从选中项中清除
                if(-1 !== num){
                    $selected.splice(num,1);
                }
                //修改状态
                if(0 === $selected.length){
                    reference.setState({$selected:[]});
                }else{
                    reference.setState($selected);
                }
            }
        );;
    }
};
const rxView = (reference) => (key) => {
    if (key) {
        const {options = {}} = G.state(reference);
        const uri = options[G.Opt.AJAX_GET_URI];
        return Ux.ajaxGet(uri, {key});
    }
};
const rxSelected = (reference) => ($selected = []) =>
    reference.setState({$selected});
export default {
    rxDelete,
    rxSelected,
    rxView,
}