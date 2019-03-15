package com.please.dataAccess

import com.please.exception.SqlAbnormalResultException
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

    @Throws(SqlAbnormalResultException::class)
    fun searchShopList(branchId: Long, shopInfo: JSONObject): String {
        return template.queryForJSONObject("CALL getSearchedShops(getUserAuthKeyById(?), ?)", branchId, shopInfo.toString())
    }

    fun getShops(searchInfo: String): MutableList<Map<String, Any?>> {
        return template.queryForList("CALL getSearchedRiderList(?)", searchInfo)
    }

    fun getMenuItems(authKey: String, shopId: Long): String {
        return template.queryForJSONObject("CALL getMenuItems(?, getUserIdById(?))", authKey, shopId)
    }

    fun getDeliveryCostByDistance(authKey: String, id: Long): String {
        return template.queryForJSONObject("CALL getCostByDistance(?, ?)", authKey, JSONObject().put("id", id).toString())
    }

    fun getDeliveryCostByDong(authKey: String, id: Long): String {
        return template.queryForJSONObject("CALL getCostByDong(?, ?)", authKey, JSONObject().put("id", id).toString())
    }
}