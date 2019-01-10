package com.please.value

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
class Condition {
    lateinit var branchId: String
    var id: Long? = null
    var shopName: String? = null
//    var riderName: String? = null
    var orderStatusIds: MutableList<Int> = mutableListOf()
    var paymentTypes: MutableList<Int> = mutableListOf()
    var isShared: Boolean = false
    lateinit var startDate: String
    lateinit var endDate: String
    var pageIndex: Long = 1
    var dateType: String = "create"
    var limitCount = 30
}