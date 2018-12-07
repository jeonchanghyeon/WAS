package com.login.add.value

import java.sql.Timestamp

data class Condition(
        val branchId: Int,
        val start_date: Timestamp,
        val end_date: Timestamp,
        val payment_type: Array<Boolean>,
        val service_type: Array<Boolean>,
        val default_start: Int,
        val delay_time: Int,
        val additional_cost_percent: Int,
        val additional_cost_won: Int
)