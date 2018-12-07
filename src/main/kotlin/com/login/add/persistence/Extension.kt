package com.login.add.persistence

import org.json.JSONObject
import org.springframework.jdbc.core.JdbcTemplate

fun JdbcTemplate.queryForJSONObject(query: String, vararg args: Any): JSONObject? {
    try {
        var str = queryForObject(query, args, String::class.java)
        return  JSONObject(str)
    } catch (e: Exception) {
        e.printStackTrace()
    }
    return null
}