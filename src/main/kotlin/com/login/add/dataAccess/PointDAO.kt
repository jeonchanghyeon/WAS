package com.login.add.dataAccess

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class PointDAO {

    @Autowired
    private lateinit var template: JdbcTemplate

    fun getPoint(id: String): Int? {
        return null
        try {
            return template.queryForObject("SELECT * FROM point WHERE id = ? ", Int::class.java, id)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}