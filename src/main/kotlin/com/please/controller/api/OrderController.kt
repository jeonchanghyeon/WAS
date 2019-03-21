package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.OrderService
import com.please.value.OrderCondition
import com.please.value.OrderReceiptInfo
import com.please.value.OrderStatus
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/orders")
class OrderController {
    @Autowired
    private lateinit var orderService: OrderService

    @GetMapping
    fun getCondition(orderCondition: OrderCondition): Any {
        val authInfo = getAuthInfo()
        return orderService.searchOrdersInfo(authInfo, orderCondition)
    }

    @RequestMapping(method = [RequestMethod.PUT])
    fun addOrder(@RequestBody orderReceiptInfo: OrderReceiptInfo): Any {
        val authInfo = getAuthInfo()
        return orderService.addOrder(authInfo.authKey, orderReceiptInfo)
    }

    @GetMapping(value = ["{id}"])
    fun getOrder(@PathVariable id: Int): Any {
        val authInfo = getAuthInfo()
        return orderService.getOrder(authInfo.authKey, id)
    }

    @RequestMapping(value = ["{id}"], method = [RequestMethod.PATCH])
    fun setOrderStatus(@PathVariable id: Int, @RequestBody orderStatus: OrderStatus): Any {
        val authInfo = getAuthInfo()
        return orderService.setOrderStatus(authInfo.authKey, orderStatus)
    }

    @GetMapping(value = ["{id}/logs"])
    fun getOrderLogs(@RequestParam(value = "page-index", required = false) pageIndex: Int?,
                     @PathVariable(value = "id") orderId: Long): Any {
        return orderService.searchOrderLogs(orderId, pageIndex)
    }

    @GetMapping(value = ["statuses"])
    fun getStatusesCount(@RequestParam(value = "branch-id") branchId: Long): Any {
        return orderService.getStatuesCount(branchId.toString())
    }

    @RequestMapping(value = ["{id}"], method = [RequestMethod.POST])
    fun setOrder(@PathVariable(value = "id") orderId: Long, @RequestBody data: MutableMap<String, Any>): Any {
        val authInfo = getAuthInfo()
        data["id"] = orderId
        return orderService.setOrder(authInfo.authKey, data)
    }
}