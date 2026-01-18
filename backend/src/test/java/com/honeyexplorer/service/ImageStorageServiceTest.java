package com.honeyexplorer.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ImageStorageServiceTest {

    @Mock
    private S3Client r2Client;

    private ImageStorageService imageStorageService;

    private static final String BUCKET_NAME = "test-bucket";
    private static final String PUBLIC_URL = "https://cdn.example.com";

    @BeforeEach
    void setUp() {
        imageStorageService = new ImageStorageService(r2Client);
        ReflectionTestUtils.setField(imageStorageService, "bucketName", BUCKET_NAME);
        ReflectionTestUtils.setField(imageStorageService, "publicUrl", PUBLIC_URL);
    }

    @Test
    void uploadImage_withByteArray_returnsCdnUrl() {
        // Given
        byte[] imageData = "test image data".getBytes();
        String key = "honeys/manuka-honey.webp";
        String contentType = "image/webp";
        when(r2Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(PutObjectResponse.builder().build());

        // When
        String result = imageStorageService.uploadImage(imageData, key, contentType);

        // Then
        assertThat(result).isEqualTo(PUBLIC_URL + "/" + key);
    }

    @Test
    void uploadImage_withByteArray_callsPutObjectWithCorrectParameters() {
        // Given
        byte[] imageData = "test image data".getBytes();
        String key = "honeys/manuka-honey.webp";
        String contentType = "image/webp";
        when(r2Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(PutObjectResponse.builder().build());

        // When
        imageStorageService.uploadImage(imageData, key, contentType);

        // Then
        ArgumentCaptor<PutObjectRequest> requestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(r2Client).putObject(requestCaptor.capture(), any(RequestBody.class));

        PutObjectRequest capturedRequest = requestCaptor.getValue();
        assertThat(capturedRequest.bucket()).isEqualTo(BUCKET_NAME);
        assertThat(capturedRequest.key()).isEqualTo(key);
        assertThat(capturedRequest.contentType()).isEqualTo(contentType);
    }

    @Test
    void uploadImage_withInputStream_returnsCdnUrl() {
        // Given
        byte[] data = "test image stream data".getBytes();
        InputStream inputStream = new ByteArrayInputStream(data);
        String key = "sources/farm-photo.webp";
        String contentType = "image/webp";
        long contentLength = data.length;
        when(r2Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(PutObjectResponse.builder().build());

        // When
        String result = imageStorageService.uploadImage(inputStream, key, contentType, contentLength);

        // Then
        assertThat(result).isEqualTo(PUBLIC_URL + "/" + key);
    }

    @Test
    void uploadImage_withInputStream_callsPutObjectWithCorrectParameters() {
        // Given
        byte[] data = "test image stream data".getBytes();
        InputStream inputStream = new ByteArrayInputStream(data);
        String key = "sources/farm-photo.webp";
        String contentType = "image/webp";
        long contentLength = data.length;
        when(r2Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(PutObjectResponse.builder().build());

        // When
        imageStorageService.uploadImage(inputStream, key, contentType, contentLength);

        // Then
        ArgumentCaptor<PutObjectRequest> requestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(r2Client).putObject(requestCaptor.capture(), any(RequestBody.class));

        PutObjectRequest capturedRequest = requestCaptor.getValue();
        assertThat(capturedRequest.bucket()).isEqualTo(BUCKET_NAME);
        assertThat(capturedRequest.key()).isEqualTo(key);
        assertThat(capturedRequest.contentType()).isEqualTo(contentType);
    }
}
