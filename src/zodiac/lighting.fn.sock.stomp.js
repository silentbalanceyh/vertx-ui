import __Zn from './zero.module.dependency';
import __O from './lighting.option.__.fn.header';
import {Stomp} from 'stompjs';

const Cv = __Zn.Env;
const sockOn = (address, callback) => {
    // 连接SockJs对应的 EndPoint
    let endpoint = Cv['ENDPOINT'];
    if (endpoint.startsWith("http:")) {
        // Stomp URI Modify
        endpoint = endpoint.replace("http:", "ws:");
    }
    // 获取STOMP自协议的客户端对象
    const stompClient = Stomp.client(`${endpoint}/api/web-socket/stomp`);
    // 关闭日志：
    stompClient.debug = null;
    // 自定义客户端的认证信息，按需求配置
    const headers = __O.headerMimeS({}, true);
    const headerJ = {};
    headers.forEach((value, key) =>
        headerJ[key] = value);
    // 发起 Ws Socket 连接
    stompClient.connect(headerJ, (res) => {
        console.log("连接成功", res, address)
        stompClient.subscribe(address, (response) => {
            console.log("收到消息", response, address);
        });
    })
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    sockOn,
}