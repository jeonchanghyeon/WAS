package com.login.add.value

import java.sql.Timestamp

data class Condition(
        val branch: String,
        val start_date: Timestamp,
        val end_date: Timestamp,
        val payment_type: Set<String>,
        val service_type: Set<String>,
        val default_start: Int,
        val delay_time: Int,
        val additional_cost_percent: Int,
        val additional_cost_won: Int
)