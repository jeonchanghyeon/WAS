package com.please.dataAccess

import com.please.persistence.queryForJSONObject
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class OrderDAO {
    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    fun getOrder(authKey: String, orderId: Int): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getOrder(?, ?)", authKey, orderId)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun setOrderStatus(authKey: String, data: String): JSONObject? {
        println(data)
//        try {
//            return template.queryForJSONObject("CALL setOrderStatus(?, ?)", authKey, jsonData)
//        } catch (e: Exception) {
//            e.printStackTrace()
//        }
        return null
    }

    fun addOrder(authKey: String, orderInfo: String): JSONObject? {
        try {
            return template.queryForJSONObject("CALL addOrder(?, ?)", authKey, orderInfo)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}