package com.please.dataAccess

import com.please.persistence.queryForJSONObject
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class ShopDAO {
    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    fun searchShopList(authKey: String, shopInfo: JSONObject): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getSearchedShopsByShopName(?, ?)", authKey, shopInfo.toString())
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}