package com.login.add.dataAccess

import com.login.add.persistence.queryForJSONObject
import com.login.add.value.AuthInfo
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class OrderInfoDAO {

    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    fun getOrderInfo(authInfo: AuthInfo, orderId: Long): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getOrder(?, ?)", authInfo.authKey, orderId)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}