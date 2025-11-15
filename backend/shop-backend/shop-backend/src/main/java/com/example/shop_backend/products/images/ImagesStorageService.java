package com.example.shop_backend.products.images;
import com.example.shop_backend.products.Product;
import com.example.shop_backend.products.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ImagesStorageService implements StorageService{
    private final String path = "C:\\Users\\krzys\\Desktop\\test\\Shop-app\\images";

    /*remove later*/
    @Autowired
    private ProductRepository productRepository;
    /**/

    @Override
    public void storeImage(String productId, MultipartFile file) throws IOException {
        if(file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to store empty file!");
        }

        Path uploadPath = Paths.get(path + "\\" + productId);
        if (!Files.exists(uploadPath)){
            createDirectory(productId);
        }

        try(InputStream inputStream= file.getInputStream()) {
            Path filePath=uploadPath.resolve(Paths.get(Objects.requireNonNull(file.getOriginalFilename())));
            Files.copy(inputStream,filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ioException){
        }

        /*replace later with productsService. ...*/
        Optional<Product> oProduct = productRepository.findById(productId);

        if (oProduct.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with id: '" + productId + "' does not exist!");
        }

        Product product = oProduct.get();
        product.addImageName(file.getOriginalFilename());
        productRepository.save(product);
        /**/

    }

    @Override
    public String[] listImages(String productId) throws IOException {
        String listPath = path + "\\" + productId;
        List<String> imagesList = new ArrayList<String>();

        File[] files = new File(listPath).listFiles();
        if(files != null) {
            for (File file : files) {
                if (file.isFile()) {
                    imagesList.add(file.getName());
                }
            }
        }

        return imagesList.toArray(new String[0]);
    }

    @Override
    public void deleteImage(String productId, String name) {
        String deletePath = path + "\\" + productId + "\\" + name;

        File fileToDelete = new File(deletePath);
        if (!fileToDelete.delete()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not delete file!");
        }

        /*replace later with productsService. ...*/
        Optional<Product> oProduct = productRepository.findById(productId);

        if (oProduct.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with id: '" + productId + "' does not exist!");
        }

        Product product = oProduct.get();
        product.deleteImageName(name);
        productRepository.save(product);
        /**/
    }

    @Override
    public Resource loadImage(String productId, String name) {
        try {
            Path file =  Paths.get(path + "\\" + productId + "\\" + name);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not read file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }

    private void createDirectory(String productId) throws IOException {
        Files.createDirectories(Paths.get(path + "\\" + productId));
    }

    @Override
    public void deleteAllImages(String productId) {
        File index = new File(path + "\\" + productId);
        String[] entries = index.list();
        if(entries != null) {
            for (String s : entries) {
                File currentFile = new File(index.getPath(), s);
                currentFile.delete();
            }
        }

        index.delete();
    }
}
