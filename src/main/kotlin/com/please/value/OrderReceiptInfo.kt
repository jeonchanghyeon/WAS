package com.please.value

import com.fasterxml.jackson.annotation.JsonProperty

data class OrderReceiptInfo(
        @JsonProperty("shop-id")
        val shopId: Long,
        @JsonProperty("customer-tel")
        val customerTel: String?,
        @JsonProperty("jibun")
        val jibun: String,
        @JsonProperty("road")
        val road: String,
        @JsonProperty("address-detail")
        val addressDetail: String,
        @JsonProperty("distance-factor")
        val distanceFactor: Double?,
        @JsonProperty("latitude")
        val latitude: Double?,
        @JsonProperty("longitude")
        val longitude: Double?,
        @JsonProperty("distance")
        val distance: Double?,
        @JsonProperty("menu")
        val menu: String,
        @JsonProperty("menu-price")
        val menuPrice: Long,
        @JsonProperty("additional-menu-price")
        val additionalMenuPrice: Long?,
        @JsonProperty("payment-type")
        val paymentType: Int,
        @JsonProperty("cook-time")
        val cookTime: Int,
        @JsonProperty("order-auto-cancel-time")
        val orderAutoCancelTime: Int,
        @JsonProperty("delivery-cost")
        val deliveryCost: Long,
        @JsonProperty("additional-cost")
        val additionalCost: Long?,
        @JsonProperty("delivery-cost-payment-type")
        val deliveryCostPaymentType: Int,
        @JsonProperty("memo")
        val memo: String?,
        @JsonProperty("is-shared")
        val isSuspend: Boolean?,        //지연됐을 경우만 true, 지연되지 않았을 경우 false(x) -> null
        @JsonProperty("point")
        val point: Long?,
        @JsonProperty("is-suspend")
        val isShared: Boolean?
)