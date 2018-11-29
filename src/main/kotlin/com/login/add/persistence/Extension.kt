package com.login.add.persistence

import org.json.JSONObject
import org.springframework.jdbc.core.JdbcTemplate

fun JdbcTemplate.queryForJSONObject(query: String, vararg args: Any): JSONObject? {
    try {
        return queryForObject(query, JSONObject::class.java, args)
    } catch (e: Exception) {
        e.printStackTrace()
    }
    return null
}