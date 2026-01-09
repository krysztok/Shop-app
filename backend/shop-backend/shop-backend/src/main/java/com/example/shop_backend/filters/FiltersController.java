package com.example.shop_backend.filters;
import com.example.shop_backend.categories.CategoriesServiceI;
import com.example.shop_backend.categories.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RequestMapping("filters/")
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class FiltersController {
    private final FiltersServiceI filtersService;
    private final CategoriesServiceI categoriesService;

    @Autowired
    public FiltersController(FiltersServiceI filtersService, CategoriesServiceI categoriesService) {
        this.filtersService = filtersService;
        this.categoriesService = categoriesService;
    }

    @GetMapping("/p/getFiltersByCategoryLabel/{categoryLabel}")
    public CustomFilter[] getFiltersByCategoryLabel(@PathVariable String categoryLabel) {
        Category category = categoriesService.getCategoryByLabel(routerLinkToString(categoryLabel));
        return filtersService.getFiltersByCategoryId(category.get_id());
    }

    @GetMapping("/a/getAllFilters")
    public List<Filter> getAllFilters(){
        return filtersService.getAllFilters();
    }

    @PostMapping("/a/createFilter")
    public void createFilter(@RequestBody FilterCreateDTO cFilterDTO){
        if (cFilterDTO.getCategoryId() != null && categoriesService.getCategoryById(cFilterDTO.getCategoryId()) == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category with id: '" + cFilterDTO.getCategoryId() + "' does not exist!");
        }

        filtersService.createFilter(cFilterDTO);
    }

    @DeleteMapping("/a/deleteFilter/{id}/{index}")
    public void deleteFilter(@PathVariable String id, @PathVariable int index){
        filtersService.deleteFilter(id, index);
    }

    public String routerLinkToString(String routerLink) {
        return routerLink.replace("-", " ");
    }
}
