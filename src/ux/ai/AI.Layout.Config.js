import Standard from './_layout/standard';
import Adjust015 from './_layout/adjust.015';
import Adjust016 from './_layout/adjust.016';
import Half05 from './_layout/half.05';
import Filter_03 from './_layout/filter-03';
import Filter_05 from './_layout/filter-05';

const item = {
    1: Standard,
    0.15: Adjust015,
    0.16: Adjust016,
    0.5: Half05,
};
item[-0.3] = Filter_03;
item[-0.5] = Filter_05;
export default item;