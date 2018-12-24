package com.login.add.service

import com.login.add.dataAccess.OrderInfoDAO
import com.login.add.value.AuthInfo
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class OrderInfoSend {
    @Autowired
    private lateinit var orderInfoDAO: OrderInfoDAO

    fun sendOrderInfo(authInfo: AuthInfo, orderId: Long): JSONObject? {
        return orderInfoDAO.getOrderInfo(authInfo, orderId)
    }
}