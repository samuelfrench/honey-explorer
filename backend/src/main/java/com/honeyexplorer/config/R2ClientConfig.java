package com.honeyexplorer.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

/**
 * Configuration for Cloudflare R2 storage client.
 * R2 is S3-compatible, so we use the AWS SDK v2 S3 client with custom endpoint.
 */
@Configuration
@ConditionalOnProperty(name = "r2.enabled", havingValue = "true")
public class R2ClientConfig {

    @Value("${r2.account.id}")
    private String accountId;

    @Value("${r2.access.key}")
    private String accessKey;

    @Value("${r2.secret.key}")
    private String secretKey;

    @Bean
    public S3Client r2Client() {
        return S3Client.builder()
                .endpointOverride(URI.create("https://" + accountId + ".r2.cloudflarestorage.com"))
                .region(Region.of("auto"))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)
                ))
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true)
                        .chunkedEncodingEnabled(false)
                        .build())
                .build();
    }
}
