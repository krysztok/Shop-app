package com.example.shop_backend.categories;
import com.example.shop_backend.filters.FiltersServiceI;
import com.example.shop_backend.products.ProductsServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RequestMapping("categories/")
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class CategoriesController {
    private final CategoriesServiceI categoriesService;
    private final ProductsServiceI productsService;
    private final FiltersServiceI filtersService;

    @Autowired
    public CategoriesController(CategoriesServiceI categoriesService, ProductsServiceI productsService, FiltersServiceI filtersService) {
        this.categoriesService = categoriesService;
        this.productsService = productsService;
        this.filtersService = filtersService;
    }

    @GetMapping("/getAllCategories")
    public List<Category> getAllCategories(){
        return categoriesService.getAllCategories();
    }

    @GetMapping("/getCategoryByLabel/{label}")
    public Category getCategoryByLabel(@PathVariable String label) {
        return categoriesService.getCategoryByLabel(routerLinkToString(label));
    }

    @GetMapping("/getCategory/{id}")
    private Category getCategoryById(@PathVariable String id) {
        return categoriesService.getCategoryById(id);
    }

    @GetMapping("/getCategoriesByIds")
    public List<Category> getCategoriesByIds(@Param("ids") String[] ids) {
        return categoriesService.getCategoriesByIds(ids);
    }

    @GetMapping("/getSubcategories/")
    public Category[] getSubCategoriesById(@RequestParam(value="categoryId") String categoryId){
        Category category = categoriesService.getCategoryById(categoryId);
        return categoriesService.getSubCategories(category);
    }

    @GetMapping("/getSubcategoriesByLabel/{label}")
    public Category[] getSubCategoriesByLabel(@PathVariable String label){
        Category category = categoriesService.getCategoryByLabel(routerLinkToString(label));
        return categoriesService.getSubCategories(category);
    }

    //for mega menu
    @GetMapping("/getAllCategoriesJson")
    public String getAllCategoriesJson() {
        return categoriesService.getAllCategoriesJson();
    }

    @GetMapping("/getCategoryNav/{label}")
    public CategoryNavDTO getCategoryNav(@PathVariable String label) {
        return categoriesService.getCategoryNav(routerLinkToString(label));
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/createCategory")
    @ResponseBody
    public void createCategory(@RequestBody Category cat) {
        categoriesService.createCategory(cat);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/updateCategory")
    @ResponseBody
    public void updateCategory(@RequestBody Category cat) {
        boolean removeProducts = categoriesService.updateCategory(cat);

        if(removeProducts) {
            productsService.removeProductsFromCategory(cat.get_id());
        }
    }

    @DeleteMapping("/deleteCategory/{id}")
    public void deleteCategory(@PathVariable String id) {
        categoriesService.deleteCategory(id);
        productsService.removeProductsFromCategory(id);
        filtersService.deleteFiltersByCategoryId(id);
    }

    public String routerLinkToString(String routerLink) {
        return routerLink.replace("-", " ");
    }

}
