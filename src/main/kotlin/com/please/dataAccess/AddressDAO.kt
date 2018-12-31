package com.please.dataAccess

import com.please.persistence.queryForJSONObject
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
internal class AddressDAO {
    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    fun getAddressList(pageIndex: Int, address: String, category: Int): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getAddressList(?, ?, ?, ?)", pageIndex, "", address, category)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun getEnableDong(authKey: String, shopId: Long): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getEnableDong(?, ?)", authKey, shopId)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}