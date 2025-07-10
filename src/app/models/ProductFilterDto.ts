export interface ProductFilterDto
{
    categoryIds: number[] | null;
    genderId: number | null;
    brandId: number | null;
    minPrice: number | null;
    maxPrice: number | null;
    searchText?: string | null;

    pageNumber?: number;
    pageSize?: number;
    sortBy?: string | null;
}