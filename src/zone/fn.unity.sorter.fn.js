import __SORT from './fn.unity.sorter';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    sorterAscFn: (key) => (left, right) => __SORT.sorterAsc(left, right, key),
    sorterAscTFn: (key) => (left, right) => __SORT.sorterAscT(left, right, key),
    sorterAscDFn: (key) => (left, right) => __SORT.sorterAscD(left, right, key),
    sorterDescFn: (key) => (left, right) => __SORT.sorterDesc(left, right, key),
    sorterDescTFn: (key) => (left, right) => __SORT.sorterDescT(left, right, key),
    sorterDescDFn: (key) => (left, right) => __SORT.sorterDescD(left, right, key)
}