package com.please.persistence

import com.please.value.AuthInfo
import com.please.value.User
import org.json.JSONObject
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.core.context.SecurityContextHolder

fun JdbcTemplate.queryForJSONObject(query: String, vararg args: Any): JSONObject? {
    try {
        var str = queryForObject(query, args, String::class.java)
        return JSONObject(str)
    } catch (e: Exception) {
        e.printStackTrace()
    }
    return null
}

fun getAuthInfo(): AuthInfo? {
    val auth = SecurityContextHolder.getContext().authentication
    val user = (auth?.principal as? User?) ?: return null

    return AuthInfo(user.userId, user.group, user.authKey)
}