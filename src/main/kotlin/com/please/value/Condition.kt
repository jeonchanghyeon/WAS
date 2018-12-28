package com.please.value

import java.sql.Timestamp

data class Condition(
        val branchId: String,
        val id: String?,
        val shopName: String?,
        val riderName: String?,
        val orderStatusIds: MutableList<Int>,
        val paymentTypes: MutableList<Int>,
        val isShared: Boolean?,
        val startDate: Timestamp,
        val endDate: Timestamp
)