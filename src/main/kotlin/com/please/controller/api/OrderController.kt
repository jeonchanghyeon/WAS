package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.value.Condition
import com.please.value.OrderReceiptInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/orders")
class OrderController {
    @Autowired
    private lateinit var statusService: StatusService
    @Autowired
    private lateinit var receptionService: OrderReceptionService

    @GetMapping
    fun getCondition(condition: Condition): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = statusService.searchOrdersInfo(authInfo, condition)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @RequestMapping(value = ["order"], method = [RequestMethod.PUT])
    fun addOrder(@RequestBody orderReceiptInfo: OrderReceiptInfo): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = receptionService.addOrder(authInfo.authKey, orderReceiptInfo)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}