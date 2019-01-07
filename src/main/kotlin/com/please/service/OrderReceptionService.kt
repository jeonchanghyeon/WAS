package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.OrderDAO
import com.please.value.OrderReceiptInfo
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class OrderReceptionService {
    @Autowired
    private lateinit var orderDAO: OrderDAO

    fun addOrder(authKey: String, orderReceiptInfo: OrderReceiptInfo): JSONObject? {
        return orderDAO.addOrder(authKey, ObjectMapper().writeValueAsString(orderReceiptInfo))
    }
}