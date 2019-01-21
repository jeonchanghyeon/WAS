package com.please.value

import com.fasterxml.jackson.annotation.JsonProperty

data class UserInfo(
        @JsonProperty("id")
        var id: Long,
        @JsonProperty("name")
        val name: String?,
        @JsonProperty("tel")
        val tel: String?,
        @JsonProperty("email")
        val email: String?,
        @JsonProperty("address")
        val address: String?,
        @JsonProperty("address-detail")
        val addressDetail: String?

) {
        constructor() : this(0, null, null, null, null, null)
}
