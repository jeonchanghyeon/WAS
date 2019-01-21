package com.please.value

import com.fasterxml.jackson.annotation.JsonProperty

data class Notice(
        @JsonProperty("id")
        var id: Long? = null,
        @JsonProperty("title")
        val title: String,
        @JsonProperty("content")
        val content: String,
        @JsonProperty("types")
        val types: MutableList<Int>? = null
)