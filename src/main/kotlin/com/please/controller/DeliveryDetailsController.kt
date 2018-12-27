package com.please.controller

import com.please.service.OrdersService
import com.please.value.AuthInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import javax.servlet.http.HttpServletRequest

@Controller
class DeliveryDetailsController {
    @Autowired
    private lateinit var ordersService: OrdersService

    @GetMapping(value = ["/details"])
    fun details(): String {
        return "delivery_details"
    }

    @GetMapping(value = ["/orders/{id}"])
    @ResponseBody
    fun getDeliveryDetails(request: HttpServletRequest, @PathVariable id: Int): Any {
        return try {
            val session = request.session
            val authInfo = session.getAttribute("authInfo") as AuthInfo?

            authInfo ?: return "login"

            var value = ordersService.getDeliveryDetails(authInfo.authKey, id)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777)
        }
    }
}