package com.please.dataAccess

import com.please.persistence.queryForJSONObject
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
internal class OrderReceiptDAO {
    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate
    fun addOrderReceipt(authKey: String, orderInfo: JSONObject): JSONObject? {
        try {
            return template.queryForJSONObject("CALL addOrder(?, ?)", authKey, orderInfo)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }


}