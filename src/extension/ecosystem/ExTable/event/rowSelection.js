import Ex from 'ex';

export default (reference) => {
    const {$batch = false} = reference.props;
    if ($batch) {
        /*
         * 批量才开启选择，如果没有批量则不需要选择操作
         */
        return {
            onChange: ($selected = []) => {
                Ex.rx(reference).selected($selected);
            }
        }
    }
}