package com.please.dataAccess

import com.please.exception.SqlAbnormalResultException
import com.please.persistence.queryForJSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class AddressDAO {
    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var mainTemplate: JdbcTemplate
    @Autowired
    @Qualifier("jdbcAddr")
    private lateinit var addrTemplate: JdbcTemplate


    @Throws(SqlAbnormalResultException::class)
    fun getAddressList(pageIndex: Int?, address: String, category: Int): String {
        return addrTemplate.queryForJSONObject("CALL getAddressList(?, ?, ?, ?)", pageIndex, "", address, category)
    }

    @Throws(SqlAbnormalResultException::class)
    fun getEnableDong(authKey: String, info: String): String {
        return mainTemplate.queryForJSONObject("CALL getEnableDongByConsonant(?, ?)", authKey, info)
    }
}