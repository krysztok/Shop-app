import { customFilters } from "./customFilter";

export interface Filters {
    priceFrom: number | null,
    priceTo: number | null,
    rating: number | null,
    customFilters: customFilters[] | null
}