import { getSelectors } from '@ngrx/router-store';

export const {
    selectQueryParams,
    selectCurrentRoute,
    selectFragment,
    selectQueryParam,
    selectRouteData,
    selectRouteParam,
    selectRouteParams,
    selectUrl
} = getSelectors();