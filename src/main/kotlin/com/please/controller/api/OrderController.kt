package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.OrderService
import com.please.value.Condition
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
    fun getCondition(condition: Condition): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = orderService.searchOrdersInfo(authInfo, condition)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @RequestMapping(method = [RequestMethod.PUT])
    fun addOrder(@RequestBody orderReceiptInfo: OrderReceiptInfo): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = orderService.addOrder(authInfo.authKey, orderReceiptInfo)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @GetMapping("{id}")
    fun getOrder(@PathVariable id: Int): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = orderService.getOrder(authInfo.authKey, id)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777)
        }
    }

    @RequestMapping("{id}", method = [RequestMethod.PATCH])
    fun setOrderStatus(@PathVariable id: Int, @RequestBody orderStatus: OrderStatus): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = orderService.setOrderStatus(authInfo.authKey, orderStatus)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777)
        }
    }
}