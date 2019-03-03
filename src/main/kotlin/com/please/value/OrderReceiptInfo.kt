package com.please.value

import com.fasterxml.jackson.annotation.JsonProperty

data class OrderReceiptInfo(
        @JsonProperty("point")
        var point: Int?,        //해당 상점의 보유 포인트(서버 처리)
        @JsonProperty("shop-id")
        val shopId: Long,
        @JsonProperty("customer-tel")
        val customerTel: String?,
        @JsonProperty("jibun")
        val jibun: String,
        @JsonProperty("road")
        val road: String,
        @JsonProperty("address-detail")
        val addressDetail: String?,
        @JsonProperty("distance-factor")
        val distanceFactor: Double?,
        @JsonProperty("latitude")
        val latitude: Double?,
        @JsonProperty("longitude")
        val longitude: Double?,
        @JsonProperty("distance")
        val distance: Double?,
        @JsonProperty("menu")
        val menu: MutableList<Map<String, Any?>>,    //ex) [{"price": 10000, "count": 2, "label": "짜장면"}, {"price": 3400, "count": 2, "label": "볶음밥"}]
        @JsonProperty("menu-price")
        val menuPrice: Long?,
        @JsonProperty("additional-menu-price")
        val additionalMenuPrice: Long?,
        @JsonProperty("payment-type")
        val paymentType: Int, //1: 카드, 2: 현금, 3: 선결제
        @JsonProperty("cook-time")
        val cookTime: Int?,
        @JsonProperty("delivery-cost")
        val deliveryCost: Long,
        @JsonProperty("additional-cost")
        val additionalCost: MutableList<Map<String, Any?>>?,    //할증 + 배달추가대행료 ex) [{"cost": 1000, "label": "지사할증"}, {"cost": 0, "label": "추가대행료"}]
        @JsonProperty("delivery-cost-payment-type")
        val deliveryCostPaymentType: Int?,       //null: 포인트, 2: 현금,
        @JsonProperty("memo")
        val memo: String?,
        @JsonProperty("is-suspend")
        val isSuspend: Boolean?       //접수대기 버튼 누를경우: true, 배송요청 누를 경우: null
)