package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.OrdersDAO
import com.please.value.OrderStatus
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class OrdersService {
    @Autowired
    private lateinit var ordersDAO: OrdersDAO

    fun getOrder(authKey: String, orderId: Int): JSONObject? {
        return ordersDAO.getOrder(authKey, orderId)
    }

    fun setOrderStatus(authKey: String, orderStatus: OrderStatus): JSONObject? {
        return ordersDAO.setOrderStatus(authKey, ObjectMapper().writeValueAsString(orderStatus))
    }
}
