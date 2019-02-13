package com.please.dataAccess

import com.please.exception.SqlAbnormalResultException
import com.please.persistence.queryForJSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class PointDAO {
    @Autowired
    @Qualifier("jdbcPoint")
    private lateinit var template: JdbcTemplate

    @Throws(SqlAbnormalResultException::class)
    fun getPoint(id: String): String {
        return template.queryForJSONObject("CALL getPoint(?)", id)
    }

    @Throws(SqlAbnormalResultException::class)
    fun checkPoint(authKey: String, point: Int, commission: Int = 0): String {
        return template.queryForJSONObject("CALL checkPoint(?,?,?)", authKey, point, commission)
    }

    @Throws(SqlAbnormalResultException::class)
    fun updatePoint(transactionInfo: String): String {
        return template.queryForJSONObject("CALL processPoints(?)", transactionInfo)
    }
}