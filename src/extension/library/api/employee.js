import Ux from 'ux';

export default {
    /*
     * 读取用户基本信息
     */
    user: () => Ux.ajaxGet(`/api/user`),
    /*
     * 更新当前用户密码
     */
    password: (params) => Ux.ajaxPost(`/api/user/password`, {
        /*
         * Token中已经包含了用户的 id
         * 所以此处只需要 password 就可以了
         */
        password: Ux.encryptMD5(params.password)
    })
}