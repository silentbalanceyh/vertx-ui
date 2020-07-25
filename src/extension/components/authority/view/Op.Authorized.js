import Ux from 'ux';

const isAuthorized = (reference) => {
    const fnBack = () => {
        const uri = Ux.toQuery("target");
        Ux.toRoute(reference, `${uri}?target=/rbac/permission`);
    }
    /*
     * 检查 targetKey
     */
    const inputKey = Ux.toQuery("targetKey");
    try {
        if (inputKey) {
            const stored = Ux.decryptBase64(inputKey);
            if (stored) {
                return JSON.parse(stored);
            } else return fnBack();
        } else return fnBack();
    } catch (error) {
        return fnBack();
    }
}
export default {
    isAuthorized
}