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

    @Value("${spring.data.mongodb.uri:mongodb://admin:admin123@ac-nykyhsq-shard-00-00.s6zxngd.mongodb.net:27017,ac-nykyhsq-shard-00-01.s6zxngd.mongodb.net:27017,ac-nykyhsq-shard-00-02.s6zxngd.mongodb.net:27017/dorabank?replicaSet=atlas-xyz123&ssl=true&authSource=admin}")
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
        return MongoClients.create(mongoUri != null ? mongoUri : "mongodb://admin:admin123@ac-nykyhsq-shard-00-00.s6zxngd.mongodb.net:27017,ac-nykyhsq-shard-00-01.s6zxngd.mongodb.net:27017,ac-nykyhsq-shard-00-02.s6zxngd.mongodb.net:27017/dorabank?replicaSet=atlas-xyz123&ssl=true&authSource=admin");
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), getDatabaseName());
    }
}
