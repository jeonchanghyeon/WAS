package com.please.persistence

import com.please.exception.SessionExpirationException
import com.please.exception.SqlAbnormalResultException
import com.please.value.AuthInfo
import com.please.value.User
import org.apache.commons.logging.LogFactory
import org.json.JSONObject
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.core.context.SecurityContextHolder
import java.io.PrintWriter
import java.io.StringWriter
import javax.servlet.http.HttpServletRequest

fun JdbcTemplate.queryForJSONObject(query: String, vararg args: Any?): String {
    val log = LogFactory.getLog("queryForJSONObject")
    val result = queryForObject(query, args, String::class.java)
    val jsonResult = JSONObject(result)

    var resultCode = 777
    when (jsonResult["resultCode"]) {
        is Int -> {
            resultCode = jsonResult["resultCode"] as Int
        }
        is String -> {
            resultCode = (jsonResult["resultCode"] as String).toInt()
        }
    }
    val description = jsonResult["description"] as String
    log.debug(result)

    if (resultCode != 0) {
        for (i in 0 until args.size) {
            log.error("request param${i+1}: ${args[i]}")
        }
        throw SqlAbnormalResultException("$query procedure failed", resultCode, "$description")
    }

    return result
}

fun getAuthInfo(): AuthInfo {
    val auth = SecurityContextHolder.getContext().authentication
    val user = (auth?.principal as? User) ?: throw SessionExpirationException("Get user authority info failed")
    return AuthInfo(user.id, user.userId, user.group, user.authKey)
}

fun getExceptionLog(e: Exception, req: HttpServletRequest): String {
    val writer = StringWriter()
    e.printStackTrace(PrintWriter(writer))
    val stacktrace = writer.toString()
    val stringBuffer = StringBuffer()
    val headers = req.headerNames
    stringBuffer.appendln().appendln("Header:")
    while (headers.hasMoreElements()) {
        val key = headers.nextElement() as String
        val value = req.getHeader(key)
        stringBuffer.appendln("   -$key : $value")
    }
    stringBuffer.appendln("User : ${req.remoteUser}")
            .appendln("Address : ${req.remoteAddr}")
            .appendln("Port : ${req.remotePort}")
            .appendln("Request URL : ${req.requestURL}")
            .appendln("Method : ${req.method}").appendln()
            .appendln(stacktrace)
            .appendln("==".repeat(50))
    return stringBuffer.toString()
}