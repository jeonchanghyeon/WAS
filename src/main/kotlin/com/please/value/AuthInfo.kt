package com.please.value

data class AuthInfo(
        val id: Long,
        val userId: String,
        val group: Int,
        val authKey: String
)