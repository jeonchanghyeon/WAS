package com.please.dataAccess

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class PointDAO {

    @Autowired
    @Qualifier("jdbcPoint")
    private lateinit var template: JdbcTemplate

    fun getPoint(authKey: String): Int? {
        try {
            return template.queryForObject("SELECT point FROM point WHERE authKey = ? ", Int::class.java, authKey)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}