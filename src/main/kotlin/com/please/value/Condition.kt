package com.please.value

import com.fasterxml.jackson.annotation.JsonProperty
import java.sql.Timestamp

data class Condition(
        @JsonProperty("branch-id")
        val branchId: String,
        @JsonProperty("id")
        val id: Long?,
        @JsonProperty("shop-name")
        val shopName: String?,
        @JsonProperty("rider-name")
        val riderName: String?,
//        @JsonProperty("order-status-ids")
//        val orderStatusIds: MutableList<Int>? = mutableListOf(-1),
//        @JsonProperty("payment-types")
//        val paymentTypes: MutableList<Int>? = mutableListOf(-1),
        @JsonProperty("is-shared")
        val isShared: Boolean?,
        @JsonProperty("start-date")
        val startDate: Timestamp,
        @JsonProperty("end-date")
        val endDate: Timestamp,
        @JsonProperty("page-Index")
        val pageIndex: Long?,
        val dateType:String = "create"
) {
    constructor() : this("1", null, null, null, null, Timestamp(0), Timestamp(0), null)
}