package com.please.value

import com.fasterxml.jackson.annotation.JsonProperty

data class OrderStatus(
        @JsonProperty("id")
        val id: Int,
        @JsonProperty("orderStatusId")
        val orderStatusId: Int,
        @JsonProperty("riderId")
        val riderId: Int
)