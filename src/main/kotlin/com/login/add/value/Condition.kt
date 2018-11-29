package com.login.add.value

import java.sql.Timestamp

//data class Condition(
//        val distributor: String,
//        val branch: String,
//        val start_data: Date,
//        val end_date: Date,
//        val payment_type: PaymentType,
//        val service_type: ServiceType,
//        val default_start: Int,
//        val delay_time: Int,
//        val additional_cost_percent: Int,
//        val additional_cost_won: Int
//)
//
//enum class PaymentType(
//
//)
//
//enum class ServiceType(
//
//)
data class Condition(
        val branch: String,
        val start_data: Timestamp,
        val end_date: Timestamp,
        val payment_type: String,
        val service_type: String,
        val default_start: String,
        val delay_time: String,
        val additional_cost_percent: String,
        val additional_cost_won: String
)