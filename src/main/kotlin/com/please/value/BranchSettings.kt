package com.please.value

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty

@JsonInclude(JsonInclude.Include.NON_NULL)
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
) {
    constructor() : this(null, null, null,  null, null, null)
}