import Ux from 'ux';

export default (reference, initState = {}, $data = []) => {
    initState = Ux.clone(initState);
    const {$table} = initState;
    if ($table.columns) {
        const lazyColumn = $table.columns
            .filter(item => "USER" === item['$render']);
        return Ux.ajaxEager(reference, lazyColumn, $data ? $data.list : [])
            .then($lazy => Ux.promise(initState, "$lazy", $lazy))
            .then(state => Ux.promise(state, "$data", $data));
    } else {
        console.error("Table columns error: ", $table);
    }
}