package com.login.add.value

import java.sql.Timestamp

data class Order(
        val id: Int,               // 순번
        val shop: String,          // 가맹정
        val status: String,        // 상태
        val statusId: String,        // 상태ID
        val shared: String,       //공유콜 여부
        val createDate: Timestamp,      // 접수시간
        val allocateDate: Timestamp,    // 배차시간
        val pickupDate: Timestamp,      // 픽업시간
        val completeDate: Timestamp,    // 완료시간
        val cancelDate: Timestamp,      // 취소시간
        val deliveryCost: Int,     // 배달대행료
        val additionalCost: String,   // 추가대행료
        val riderName: String,     // 기사이름
        val paymentType: String,   // 결제방법
        val requests: String   // 요청사항
)