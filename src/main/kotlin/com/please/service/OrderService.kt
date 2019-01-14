package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.OrderDAO
import com.please.value.OrderStatus
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class OrderService {
    @Autowired
    private lateinit var orderDAO: OrderDAO

    fun getOrder(authKey: String, orderId: Int): JSONObject? {
        return orderDAO.getOrder(authKey, orderId)
    }

    fun setOrderStatus(authKey: String, orderStatus: OrderStatus): JSONObject? {
        return orderDAO.setOrderStatus(authKey, ObjectMapper().writeValueAsString(orderStatus))
    }
}
