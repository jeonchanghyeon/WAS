package com.please.value

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
class NoticeCondition {
    var viewType: Int = 0
    var writerId: Long? = null
    var viewGroups: MutableList<Int> = mutableListOf()
    var pageIndex: Int? = null
    var limitCount: Int? = null
}