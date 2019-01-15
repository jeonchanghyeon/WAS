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
        @JsonProperty("is-suspend")
        val isSuspend: Boolean?,        //접수대기 버튼 누를경우: true, 배송요청 누를 경우: false(x) -> null
        @JsonProperty("point")
        val point: Long?,
        @JsonProperty("is-shared")
        val isShared: Boolean?,
        @JsonProperty("is-point")
        val isPoint: Boolean?
)