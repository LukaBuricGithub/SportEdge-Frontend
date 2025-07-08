export interface ProductFilterDto
{
    categoryIds: number[] | null;
    genderId: number | null;
    brandId: number | null;
    minPrice: number | null;
    maxPrice: number | null;
}