import Ux from 'ux';

export default {
    mock: true,
    data: {
        "user": {
            "umid": "dalei@company1.com",
            "userName": "DaLei",
            "loginName": "DaLei",
            "userPassword": null,
            "userDesc": null,
            "gender": null,
            "birthday": null,
            "email": "dalei@company1.com",
            "telphone": null,
            "mobile": null,
            "company": "Company1",
            "companyCode": "company1",
            "title": null,
            "departmentId": null,
            "departmentName": null,
            "status": null,
            "partnerFullName": null,
            "id": null,
            "tenantId": null,
            "tenant": {
                "rid": null,
                "caName": "Company1",
                "caCode": "company1",
                "caShortName": "Company1",
                "phone": null,
                "fax": null,
                "status": null,
                "contractStartDate": null,
                "contractEndDate": null,
                "createTime": null,
                "updateTime": null,
                "opUmid": null,
                "adminName": null,
                "adminEmail": "dalei@company1.com",
                "adminPhone": null
            },
            "proxyUmid": null,
            "userGroup": 2,
            "tenantAdmin": true
        },
        "token": "9253edacf2ff422992f1376a046cff38"
    },
    processor: (response, params = {}) => {
        if ("lang.yu" === params.username) {
            return Ux.promise(response);
        } else {
            return Promise.reject({
                code: -10013,
                info: "对不起，密码错误！"
            })
        }
    }
}