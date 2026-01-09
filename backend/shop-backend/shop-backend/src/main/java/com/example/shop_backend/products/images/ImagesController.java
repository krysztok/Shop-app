package com.example.shop_backend.products.images;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequestMapping("images/")
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ImagesController {
    private final StorageService storageService;

    @Autowired
    public ImagesController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/p/getImage/{productId}/{name}")
    public ResponseEntity<Resource> getImage(@PathVariable String productId, @PathVariable String name) {
        Resource file = storageService.loadImage(productId, name);

        if (file == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @GetMapping("/a/listImages/{productId}")
    public String[] listImages(@PathVariable String productId) throws IOException {
        return storageService.listImages(productId);
    }

    @PostMapping("/a/saveImage/{productId}")
    public void saveImage(@PathVariable String productId, @RequestParam("file") MultipartFile file) throws IOException {
        storageService.storeImage(productId, file);
    }

    @DeleteMapping("/a/deleteImage/{productId}/{name}")
    public void deleteImage(@PathVariable String productId, @PathVariable String name) {
        storageService.deleteImage(productId, name);
    }
}
