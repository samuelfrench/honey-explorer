package com.honeyexplorer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.InputStream;

/**
 * Service for uploading images to Cloudflare R2 storage.
 * Returns CDN URLs for uploaded images.
 */
@Service
@ConditionalOnProperty(name = "r2.enabled", havingValue = "true")
public class ImageStorageService {

    private final S3Client r2Client;

    @Value("${r2.bucket.name}")
    private String bucketName;

    @Value("${r2.public.url}")
    private String publicUrl;

    public ImageStorageService(S3Client r2Client) {
        this.r2Client = r2Client;
    }

    /**
     * Upload image from byte array.
     *
     * @param imageData   The image data as bytes
     * @param key         The storage key (path/filename)
     * @param contentType The MIME type (e.g., "image/webp")
     * @return The public CDN URL for the uploaded image
     */
    public String uploadImage(byte[] imageData, String key, String contentType) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .build();

        r2Client.putObject(request, RequestBody.fromBytes(imageData));

        return publicUrl + "/" + key;
    }

    /**
     * Upload image from input stream.
     *
     * @param inputStream   The image data as stream
     * @param key           The storage key (path/filename)
     * @param contentType   The MIME type (e.g., "image/webp")
     * @param contentLength The size of the content in bytes
     * @return The public CDN URL for the uploaded image
     */
    public String uploadImage(InputStream inputStream, String key, String contentType, long contentLength) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .build();

        r2Client.putObject(request, RequestBody.fromInputStream(inputStream, contentLength));

        return publicUrl + "/" + key;
    }
}
