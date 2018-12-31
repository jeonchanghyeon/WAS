package com.please.value

data class ReceiptInfo(
    val shopId: Long,
    val customerTel: String?,
    val jibun: String,
    val road: String,
    val addressDetail: String,
    val distanceFactor: Double?,
    val latitude: Double?,
    val longitude: Double?,
    val distance: Double?,
    val menu: String,
    val menuPrice: Long,
    val additionalMenuPrice: Long?,
    val paymentType: Int,
    val cookTime: Int,
    val orderAutoCancelTime: Int,
    val deliveryCost: Long,
    val additionalCost: String?,
    val deliveryCostPaymentType: Int,
    val memo: String?,
    val isSuspend: Boolean?, //true이거나 값x(false x)
    //??
    val point: Long?,
    val orderLimitAmount: Long?,
    val isShared: Boolean?
)