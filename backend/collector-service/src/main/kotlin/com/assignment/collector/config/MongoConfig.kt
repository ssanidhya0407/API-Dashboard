package com.assignment.collector.config

import org.springframework.boot.autoconfigure.mongo.MongoProperties
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.mongodb.MongoDatabaseFactory
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories

@Configuration
@EnableMongoRepositories(
    basePackages = ["com.assignment.collector.repository.logs"],
    mongoTemplateRef = "primaryMongoTemplate"
)
class PrimaryMongoConfig {

    @Primary
    @Bean(name = ["primaryMongoProperties"])
    @ConfigurationProperties(prefix = "spring.data.mongodb.primary")
    fun getPrimaryProperties(): MongoProperties {
        return MongoProperties()
    }

    @Primary
    @Bean(name = ["primaryMongoFactory"])
    fun primaryMongoFactory(primaryMongoProperties: MongoProperties): MongoDatabaseFactory {
        return SimpleMongoClientDatabaseFactory(primaryMongoProperties.uri)
    }

    @Primary
    @Bean(name = ["primaryMongoTemplate"])
    fun primaryMongoTemplate(primaryMongoFactory: MongoDatabaseFactory): MongoTemplate {
        return MongoTemplate(primaryMongoFactory)
    }
}

@Configuration
@EnableMongoRepositories(
    basePackages = ["com.assignment.collector.repository.metadata"],
    mongoTemplateRef = "secondaryMongoTemplate"
)
class SecondaryMongoConfig {

    @Bean(name = ["secondaryMongoProperties"])
    @ConfigurationProperties(prefix = "spring.data.mongodb.secondary")
    fun getSecondaryProperties(): MongoProperties {
        return MongoProperties()
    }

    @Bean(name = ["secondaryMongoFactory"])
    fun secondaryMongoFactory(secondaryMongoProperties: MongoProperties): MongoDatabaseFactory {
        return SimpleMongoClientDatabaseFactory(secondaryMongoProperties.uri)
    }

    @Bean(name = ["secondaryMongoTemplate"])
    fun secondaryMongoTemplate(secondaryMongoFactory: MongoDatabaseFactory): MongoTemplate {
        return MongoTemplate(secondaryMongoFactory)
    }
}
