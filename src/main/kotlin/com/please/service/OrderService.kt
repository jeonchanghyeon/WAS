package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.OrderDAO
import com.please.value.AuthInfo
import com.please.value.Condition
import com.please.value.OrderReceiptInfo
import com.please.value.OrderStatus
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.sql.Timestamp

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

    @Transactional
    fun addOrder(authKey: String, orderReceiptInfo: OrderReceiptInfo): JSONObject? {
        return orderDAO.addOrder(authKey, ObjectMapper().writeValueAsString(orderReceiptInfo))
    }

    fun searchOrdersInfo(authInfo: AuthInfo, condition: Condition): JSONObject? {
        val branchId = condition.branchId

        val ordersResult = orderDAO.searchOrders(branchId, ObjectMapper().writeValueAsString(condition).toString().replace("shared", "isShared"))

        print("ordersResult")
        println(ordersResult)
        ordersResult ?: return null

        val startDate = Timestamp.valueOf(condition.startDate)
        val endDate = Timestamp.valueOf(condition.endDate)

        val countsResult = orderDAO.getOrderStatusCounts(branchId, startDate, endDate)

        print("countsResult")
        println(countsResult)

        countsResult ?: return null

        val result = JSONObject()

        result.put("orders", ordersResult["orders"])
        result.put("counts", countsResult["info"])

        return result
    }

    fun searchOrderLogs(orderId: Long, pageIndex: Int?): JSONObject? {
        val logCondition = JSONObject()

        logCondition.put("oId", orderId)
        logCondition.put("pageIndex", pageIndex)

        return orderDAO.getSearchLogOrders(logCondition.toString())
    }
}
