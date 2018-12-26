package com.please.value

import java.sql.Timestamp

data class Condition(
        val branchId: String,
        val start_date: Timestamp,
        val end_date: Timestamp,
        val payment_type: Array<Boolean>,
        val service_type: Array<Boolean>
)