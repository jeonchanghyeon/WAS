package com.please.value

import com.fasterxml.jackson.annotation.JsonProperty

data class Notice(
        @JsonProperty("id")
        var id: Long?,
        @JsonProperty("title")
        val title: String,
        @JsonProperty("content")
        val content: String,
        @JsonProperty("types")
        val types: MutableList<Int>?
) {
        constructor() : this(null, "", "",  null)
}