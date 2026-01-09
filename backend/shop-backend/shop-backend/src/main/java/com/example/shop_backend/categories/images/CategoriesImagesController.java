package com.example.shop_backend.categories.images;
import com.example.shop_backend.products.images.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequestMapping("categoriesImages/")
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class CategoriesImagesController {
    private final CategoryImagesStorageService ciStorageService;

    @Autowired
    public CategoriesImagesController(CategoryImagesStorageService categoryImagesStorageService) {
        this.ciStorageService = categoryImagesStorageService;
    }

    @GetMapping("/p/getImage/{categoryId}")
    public ResponseEntity<Resource> getImage(@PathVariable String categoryId) {
        Resource file = ciStorageService.loadImage(categoryId);

        if (file == null) {
            return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION).body(file);
        }

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @PostMapping("/a/saveImage/{categoryId}")
    public void saveImage(@PathVariable String categoryId, @RequestParam("file") MultipartFile file) throws IOException {
        ciStorageService.storeImage(categoryId, file);
    }

    @DeleteMapping("/a/deleteImage/{categoryId}")
    public void deleteImage(@PathVariable String categoryId) {
        ciStorageService.deleteImage(categoryId);
    }
}
