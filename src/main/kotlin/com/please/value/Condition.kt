package com.please.value

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_EMPTY)
class Condition {
    var branchId: String? = null
    var id: Long? = null
    var shopName: String? = null
    var riderName: String? = null
    var orderStatusIds: List<Int>? = null
    var paymentTypes: List<Int>? = null
    var _isShared: Boolean? = null
    var startDate: String? = null
    var endDate: String? = null
    var pageIndex: Long? = null
    var dateType: String = "create"
}