import {_I} from 'zet';
import Ux from 'ux';

const init = (reference) => ({
    /*
     * 企业信息读取，两个地方需要用到
     * 1）企业信息管理：/organization/company
     * 2）企业信息查看：/personal/company
     */
    company: () => {
        Ux.of(reference).readying().handle(() =>
            _I.company().then($inited => {

                Ux.of(reference).in({
                    $inited
                }).ready().done()
                // reference.?etState({
                //     $ready: true, $inited
                // })
            }).catch($error => {

                Ux.of(reference).in({
                    $error
                }).ready().done()
                // reference.?etState({$ready: true, $error})
            }))
        // reference.?etState({$ready: false});
        // _I.company().then($inited => reference.?etState({
        //     $ready: true, $inited
        // })).catch($error => reference.?etState({$ready: true, $error}))
    }
});
export default {
    init,
}