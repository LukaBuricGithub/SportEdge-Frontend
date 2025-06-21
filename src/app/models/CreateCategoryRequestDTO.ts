export interface CreateCategoryRequestDTO 
{
  name: string;
  parentCategoryId?: number | null;
    /*
    C# code

     [Required]
 [StringLength(150, MinimumLength = 2)]
 public string Name { get; set; }

 /// <summary>
 /// Parent category's ID (can be null).
 /// </summary>
 public int? ParentCategoryId { get; set; }
    */
}