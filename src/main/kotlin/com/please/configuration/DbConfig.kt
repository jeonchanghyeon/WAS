package com.please.configuration

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.datasource.DataSourceTransactionManager
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.annotation.EnableTransactionManagement
import javax.sql.DataSource


@Configuration
@EnableTransactionManagement
class DbConfig {
    @Bean(name = ["dsPoint"])
    @ConfigurationProperties(prefix = "spring.pointDb.datasource")
    fun slaveDataSource(): DataSource {
        return DataSourceBuilder.create().build()
    }

    @Bean(name = ["dsMain"])
    @Primary
    @ConfigurationProperties(prefix = "spring.mainDb.datasource")
    fun masterDataSource(): DataSource {
        return DataSourceBuilder.create().build()
    }

    @Bean
    fun transactionManager(): PlatformTransactionManager {
        val tm = DataSourceTransactionManager()
        tm.dataSource = masterDataSource()
        return tm
    }

    @Bean(name = ["jdbcPoint"])
    @Autowired
    fun pointJdbcTemplate(@Qualifier("dsPoint") dsPoint: DataSource): JdbcTemplate {
        return JdbcTemplate(dsPoint)
    }

    @Bean(name = ["jdbcMain"])
    @Autowired
    fun mainJdbcTemplate(@Qualifier("dsMain") dsMain: DataSource): JdbcTemplate {
        return JdbcTemplate(dsMain)
    }
}