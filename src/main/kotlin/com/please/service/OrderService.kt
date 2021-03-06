package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.OrderDAO
import com.please.exception.SqlAbnormalResultException
import com.please.value.AuthInfo
import com.please.value.OrderCondition
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
    @Autowired
    private lateinit var pointService: PointService

    fun getOrder(authKey: String, orderId: Int): String {
        return orderDAO.getOrder(authKey, orderId)
    }

    @Throws(SqlAbnormalResultException::class)
    fun setOrderStatus(authKey: String, orderStatus: OrderStatus): String {
        return orderDAO.setOrderStatus(authKey, ObjectMapper().writeValueAsString(orderStatus))
    }

    @Transactional
    fun addOrder(authKey: String, orderReceiptInfo: OrderReceiptInfo): String {
        val pointObj = JSONObject(pointService.getPoint(orderReceiptInfo.shopId))
        orderReceiptInfo.point = (pointObj["point"] as JSONObject)["point"] as Int
        orderReceiptInfo.additionalCost!!.add(mapOf("cost" to orderReceiptInfo.additionalDeliveryCost, "label" to "추가대행료"))
        return orderDAO.addOrder(authKey, ObjectMapper().writeValueAsString(orderReceiptInfo).toString().replace("suspend", "isSuspend"))
    }

    fun setOrder(authKey: String, orderInfo: MutableMap<String, Any>): String {
        return orderDAO.setOrder(authKey, ObjectMapper().writeValueAsString(orderInfo))
    }

    fun searchOrdersInfo(authInfo: AuthInfo, condition: OrderCondition): String {
        val branchId = condition.branchId
        val startDate = Timestamp.valueOf(condition.startDate)
        val endDate = Timestamp.valueOf(condition.endDate)

        val ordersResult = orderDAO.searchOrders(branchId, ObjectMapper().writeValueAsString(condition).toString().replace("shared", "isShared"))
        val countsResult = orderDAO.getOrderStatusCounts(branchId, startDate, endDate)

        val result = JSONObject()
        result.put("orders", JSONObject(ordersResult)["orders"])
        result.put("counts", JSONObject(countsResult)["info"])

        return result.toString()
    }

    fun reRegOrder(authKey: String, orderId: Int): String {
        val order = JSONObject(orderDAO.getOrder(authKey, orderId))["order"] as JSONObject
        val pointObj = JSONObject(pointService.getPoint((order["shopId"] as Int).toLong()))
        val point = (pointObj["point"] as JSONObject)["point"] as Int
        order.put("point", point)
        //result.put("isSuspend", true);

        return orderDAO.addOrder(authKey, order.toString())
    }

    fun searchOrderLogs(orderId: Long, pageIndex: Int?): String {
        val logCondition = JSONObject()

        logCondition.put("oId", orderId)
        logCondition.put("pageIndex", pageIndex)

        return orderDAO.getSearchLogOrders(logCondition.toString())
    }

    fun getStatuesCount(branchId: String): String {
        return orderDAO.getOrderStatusCounts(branchId, null, null)
    }
}
