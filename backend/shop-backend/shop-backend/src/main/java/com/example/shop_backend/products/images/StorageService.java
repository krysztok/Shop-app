package com.example.shop_backend.products.images;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface StorageService {

    void storeImage(String productId, MultipartFile file) throws IOException;
    String[] listImages(String productId) throws IOException;
    void deleteImage(String productId, String name);
    void deleteAllImages(String productId);
    Resource loadImage(String productId, String name);

}
