package com.please.dataAccess

import com.please.persistence.queryForJSONObject
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
internal class ShopsControlDAO {
    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    fun searchShops(authKey: String, shopInfo: JSONObject): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getSearchedShops(?, ?)", authKey, shopInfo.toString())
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}