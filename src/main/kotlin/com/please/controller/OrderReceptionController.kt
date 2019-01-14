package com.please.controller

import com.please.persistence.getAuthInfo
import com.please.service.OrderReceptionService
import com.please.value.OrderReceiptInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.ResponseBody

@Controller
@RequestMapping("order-reception")
class OrderReceptionController {
    @Autowired
    private lateinit var receptionService: OrderReceptionService

    @RequestMapping(value = ["efg"], method = [RequestMethod.PUT])
    @ResponseBody
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