package com.please.value

import com.fasterxml.jackson.annotation.JsonProperty


data class BranchSettings (
    @JsonProperty("id")
    var id: Long?,
    @JsonProperty("basicStartTime")
    val basicStartTime: Int?,
    @JsonProperty("delayTime")
    val delayTime: Int?,
    @JsonProperty("extraCharge")
    val extraCharge: Int?,
    @JsonProperty("extraChargePercent")
    val extraChargePercent: Double?,
    @JsonProperty("enableOrderAccept")
    val enableOrderAccept: String?
)