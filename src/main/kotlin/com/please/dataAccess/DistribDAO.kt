package com.please.dataAccess

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class DistribDAO {

    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    //총판 이름과 id를 쿼리
    fun getDistributors(id: Long): MutableList<Map<String, Any?>>? {
        try {
            return template.queryForList("CALL getDistributorListById(?)", id)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}