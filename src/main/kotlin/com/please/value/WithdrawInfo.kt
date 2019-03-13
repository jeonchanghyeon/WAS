package com.please.value

import com.fasterxml.jackson.annotation.JsonProperty

data class WithdrawInfo (
        @JsonProperty("id")
        var id: Long?,
        @JsonProperty("authKey")
        var authKey: String?,
        @JsonProperty("commission")
        var commission: Int?,
        @JsonProperty("point")
        val point: Int,
        @JsonProperty("point-password")
        val pointPassword: String
)