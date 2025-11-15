package com.example.shop_backend.categories.images;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CategoryImagesStorageService {
    void storeImage(String categoryId, MultipartFile file) throws IOException;
    void deleteImage(String categoryId);
    Resource loadImage(String categoryId);

}
