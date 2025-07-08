export interface CreateProductRequestDTO 
{

    name:string;
    shortDescription:string;
    price:number;
    discountedPrice?: number | null;
    categoryIds:number[];
    brandId:number;
    genderId:number;

    /*
        [Required]
        [StringLength(150, MinimumLength = 2)]
        public string Name { get; set; }

        [Required]
        [StringLength(300, MinimumLength = 2)]
        public string ShortDescription { get; set; }

        [Required]
        public decimal Price { get; set; }

        public decimal? DiscountedPrice { get; set; }

        [Required]
        [NotEmptyList(ErrorMessage = "At least one category must be selected.")]
        public List<int> CategoryIds { get; set; }

        [Required]
        public int BrandId { get; set; }

        [Required]
        public int GenderId { get; set; }
    */ 
}