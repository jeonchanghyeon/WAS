package com.please.value

data class TransactionInfo(
        var target: String,
        val point: Int,
        val type: Int,
        val issueId: Long,
        val description: String
)