import randomjs from 'random-js';
import { v4 } from 'uuid';
import Dg from './Ux.Debug';
const randomString = (length) => {
    Dg.ensureNotNull(length);
    const engine = randomjs.engines.mt19937().autoSeed();
    return randomjs.string()(engine, length);
};

export default {
    randomUUID: v4,
    randomString
}
