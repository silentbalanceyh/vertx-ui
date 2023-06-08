import {MersenneTwister19937, Random} from 'random-js';
import {v4} from 'uuid';
import __E from './fn.debug.fx.error';

const randomString = (length) => {
    __E.fxTerminal(!length, 10062, length);
    // 1.0 旧版本：const engine = randomjs.engines.mt19937().autoSeed();
    const engine = MersenneTwister19937.autoSeed();
    const random = new Random(engine);
    return random.string(length); // randomjs.string()(engine, length);
};
const randomInteger = (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max + 1)) + min;
};
const randomArray = (array = []) => {
    const index = randomInteger(0, array.length - 1);
    return array[index];
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    randomString,
    randomUUID: () => v4(),
    randomArray,
    randomInteger
}