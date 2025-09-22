export interface Rating {
    _id:string;
    user: string;
    value: number;
    comment: string;
    date: Date | undefined;
}