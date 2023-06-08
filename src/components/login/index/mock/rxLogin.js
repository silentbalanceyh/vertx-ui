import Immutable from "immutable";
import Data from './fnLogin'

const ROLE_MAPPING = {
    "lang.yu": "SUPER.ADMIN", // 超级管理员
    "1000": "HOTEL.MANAGER", // 总经理
    "2000": "LABOR.MANAGER", // 大堂经理
    "2001": "LABOR.EMPLOYEE", // 接待职员
    "2002": "LABOR.FAN",// 收银职员
    "3000": "SALES.MANAGER", // 销售经理
    "3001": "SALES.EMPLOYEE", // 销售职员
    "4000": "FAN.MANAGER", // 财务经理
    "4001": "FAN.EMPLOYEE", // 财务员
    "5000": "ROOM.MANAGER", // 客房部经理
    "5001": "ROOM.EMPLOYEE", // 客房部人员
    "6000": "SYSTEM.ADMIN",//系统管理员
};

export default {
    "mock": Data.mock,
    "comment": "登录接口：POST：/auth/login",
    "data": Data.data,
    processor: (data, params) => {
        data = Immutable.fromJS(data).toJS();
        if (params.username && ROLE_MAPPING[params.username]) {
            data.roleCode = ROLE_MAPPING[params.username];
        }
        return data;
    }
}