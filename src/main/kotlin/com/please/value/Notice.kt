package com.please.value

import com.fasterxml.jackson.annotation.JsonProperty

data class Notice(
        @JsonProperty("id")
        var id: Long,
        @JsonProperty("title")
        val title: String,
        @JsonProperty("content")
        val contents: String,
        @JsonProperty("types")
        val types: MutableList<Int>?
)