package com.please.dataAccess

import com.please.persistence.queryForJSONObject
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
internal class ShopsManagementDAO {
    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    fun searchShops(authKey: String, shopInfo: JSONObject): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getSearchedShops(?, ?)", authKey, shopInfo)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}