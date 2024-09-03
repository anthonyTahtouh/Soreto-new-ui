interface ApiResult {
    resultData: any
}

interface ApiPaginatedResult<T> {
    page: T[];
    totalCount: number;
}