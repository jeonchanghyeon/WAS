package com.please.controller

import com.please.persistence.getAuthInfo
import com.please.service.OrdersService
import com.please.value.OrderStatus
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*


@Controller
class DeliveryDetailsController {
    @Autowired
    private lateinit var ordersService: OrdersService

    @GetMapping("/orders/{id}")
    @ResponseBody
    fun getOrder(@PathVariable id: Int): Any {
        return try {
            val authInfo = getAuthInfo()!!

            var value = ordersService.getOrder(authInfo.authKey, id)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777)
        }
    }

    @RequestMapping("/orders/{id}", method = [RequestMethod.PATCH])
    @ResponseBody
    fun setOrderStatus(@PathVariable id: Int, @RequestBody orderStatus: OrderStatus): Any {
        return try {
            val authInfo = getAuthInfo()!!

            var value = ordersService.setOrderStatus(authInfo.authKey, orderStatus)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777)
        }
    }
}