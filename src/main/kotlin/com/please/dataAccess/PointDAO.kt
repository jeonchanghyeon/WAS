package com.please.dataAccess

import com.please.exception.SqlAbnormalResultException
import com.please.persistence.queryForJSONObject
import org.json.JSONObject
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
}