package com.login.add.persistence

import org.json.JSONObject
import org.springframework.jdbc.core.JdbcTemplate

fun JdbcTemplate.queryForJSONObject(query: String, vararg args: Any): JSONObject?{
    try {
        var result: JSONObject? = null
        query(query, args) {
            it.first()

            println(it.getString(1))
            result = JSONObject(it.getString(1)) // 결과 Row가 하나일 경우
        }
        return result
    } catch (e: Exception) {
        e.printStackTrace()
    }
    return null
}