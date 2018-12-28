package com.please.value

data class ReceiptInfo(
    val shopId: Long,
    val deliveryCostPaymentType: String?,
    val orderAutoCancelTime: String?,
    val distanceFactor: String?,
    val point: String?,
    val orderLimitAmount: String?,
    val deliveryCost: String?,
    val additionalCost: String?,
    val isSuspend: String?,
    val paymentType: String?,
    val jibun: String?,
    val road: String?,
    val addressDetail: String?,
    val latitude: String?,
    val longitude: String?,
    val distance: String?,
    val menu: String?,
    val menuPrice: String?,
    val additionalMenuPrice: String?,
    val customerTel: String?,
    val memo: String?,
    val cookTime: String?,
    val isShared: String?
)