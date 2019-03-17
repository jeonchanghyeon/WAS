package com.please.value

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty

@JsonInclude(JsonInclude.Include.NON_NULL)
data class OrderStatus(
        @JsonProperty("id")
        val id: Int,
        @JsonProperty("orderStatusId")
        val orderStatusId: Int,
        @JsonProperty("riderId")
        val riderId: Int?
) {
        constructor(): this(0, 0, null)
}