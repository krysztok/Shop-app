package com.example.shop_backend.categories.images;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

@Service
public class CIStorageService implements CategoryImagesStorageService {
    private final String path = "C:\\Users\\krzys\\Desktop\\test\\Shop-app\\cImages";

    @Override
    public void storeImage(String categoryId, MultipartFile file) throws IOException {
        if(file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to store empty file!");
        }

        Path uploadPath = Paths.get(path);
        try(InputStream inputStream= file.getInputStream()) {
            Path filePath=uploadPath.resolve(Paths.get(categoryId));
            Files.copy(inputStream,filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ioException){
        }
    }

    @Override
    public void deleteImage(String categoryId) {
        String deletePath = path + "\\" + categoryId;

        File fileToDelete = new File(deletePath);
        if (!fileToDelete.delete()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not delete file!");
        }
    }

    @Override
    public Resource loadImage(String categoryId) {
        try {
            Path file =  Paths.get(path + "\\" + categoryId);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                return null;
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }

}
