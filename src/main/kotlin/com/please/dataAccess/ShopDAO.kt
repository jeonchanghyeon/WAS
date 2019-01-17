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

    fun searchShopList(branchId: Long, shopInfo: JSONObject): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getSearchedShops(getUserAuthKeyById(?), ?)", branchId, shopInfo.toString())
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun getShops(id: Long): MutableList<Map<String, Any?>>? {
        try {
            return template.queryForList("CALL getShopListById(?)", id)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}