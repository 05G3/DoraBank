package com.dorabank.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.lang.NonNull;

@Configuration
@ConditionalOnProperty(name = "spring.data.mongodb.enabled", havingValue = "true", matchIfMissing = false)
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri:mongodb+srv://dorarakesh8_db_user:mFfplG05VnmB2fh0@cluster0.wn9ybwl.mongodb.net/dorabank?retryWrites=true&w=majority}")
    private String mongoUri;

    @Value("${spring.data.mongodb.database:dorabank}")
    private String databaseName;

    @Override
    @NonNull
    protected String getDatabaseName() {
        return databaseName != null ? databaseName : "dorabank";
    }

    @Bean
    @Override
    @NonNull
    public MongoClient mongoClient() {
        return MongoClients.create((mongoUri != null ? mongoUri : "mongodb+srv://dorarakesh8_db_user:mFfplG05VnmB2fh0@cluster0.wn9ybwl.mongodb.net/dorabank?retryWrites=true&w=majority"));
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), getDatabaseName());
    }
}
