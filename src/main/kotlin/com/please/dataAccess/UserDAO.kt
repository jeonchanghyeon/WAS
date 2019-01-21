package com.please.dataAccess

import com.please.persistence.queryForJSONObject
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class UserDAO {
    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    fun getInfo(authKey: String, id: Long): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getUser(?, ?)", authKey, id)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun setInfo(authKey: String, userInfo: String): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getUser(?, ?)", authKey, userInfo)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}