package com.please.service

import com.please.dataAccess.OrdersDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class OrdersService {
    @Autowired
    private lateinit var ordersDAO: OrdersDAO

    fun getDeliveryDetails(authKey: String, orderId: Int): JSONObject? {
        return ordersDAO.getDeliveryDetails(authKey, orderId)
    }
}
