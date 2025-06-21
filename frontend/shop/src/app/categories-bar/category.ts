export interface Category {
    _id: string;
    label: string;
    routerLink: string;
    type: string
    items: string[];
    parentId: string;
}