package com.please.dataAccess

import com.please.exception.SqlAbnormalResultException
import com.please.persistence.queryForJSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository


@Repository
class UserDAO {
    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    @Throws(SqlAbnormalResultException::class)
    fun getInfo(authKey: String, id: Long): String {
        return template.queryForJSONObject("CALL getUser(?, ?)", authKey, id)
    }

    @Throws(SqlAbnormalResultException::class)
    fun setInfo(authKey: String, userInfo: String): String {
        return template.queryForJSONObject("CALL setUser(?, ?)", authKey, userInfo)
    }
}