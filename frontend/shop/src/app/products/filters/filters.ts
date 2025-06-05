import { customFilters } from "./customFilter";

export interface Filters {
    _id: string | null,
    category_id: string | null,
    priceFrom: number | null,
    priceTo: number | null,
    rating: number | null,
    filters: customFilters[] | null
}