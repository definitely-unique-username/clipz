export const SORT_QUERY_PARAM = 'sort';

export enum Sort {
    ASC = 'asc',
    DESC = 'desc'
}

export function isSort(sort: unknown): sort is Sort {
    return sort === Sort.ASC || sort === Sort.DESC;
}