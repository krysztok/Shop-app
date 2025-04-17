export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    active: boolean;
    ratingValue: number;
    params: Map<string, any>;
}