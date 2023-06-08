import Ux from 'ux';

export default (reference, jsx) => {
    jsx.onPressEnter = (event) => {
        Ux.prevent(event);
        Ux.connectId("$opLogin");
    };
    // $session 处理
    const {$session} = reference.state ? reference.state : {};
    if ($session) {
        jsx.$session = $session;
    }
    return Ux.aiCaptcha(reference, jsx);
}