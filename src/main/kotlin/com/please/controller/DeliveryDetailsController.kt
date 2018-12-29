package com.please.controller

import com.please.service.OrdersService
import com.please.value.AuthInfo
import com.please.value.OrderStatus
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import javax.servlet.http.HttpServletRequest


@Controller
class DeliveryDetailsController {
    @Autowired
    private lateinit var ordersService: OrdersService

    @GetMapping(value = ["/details/{id}"])
    fun details(@PathVariable id: Int, model: Model): String {
        model.addAttribute("id", id)

        return "delivery_details"
    }

    @GetMapping(value = ["/orders/{id}"])
    @ResponseBody
    fun getOrder(request: HttpServletRequest, @PathVariable id: Int): Any {
        return try {
//            val session = request.session
//            val authInfo = session.getAttribute("authInfo") as AuthInfo?
//
//            authInfo ?: return "login"

            val authInfo = AuthInfo("god", 7, "6874b3d4aa9c8473f50fa3a2a29529f2")

            var value = ordersService.getOrder(authInfo.authKey, id)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777)
        }
    }

    @RequestMapping(value = ["/orders/{id}"], method = [RequestMethod.PATCH])
    @ResponseBody
    fun setOrderStatus(request: HttpServletRequest, @PathVariable id: Int, @RequestBody orderStatus: OrderStatus): Any {
        return try {
//            val session = request.session
//            val authInfo = session.getAttribute("authInfo") as AuthInfo?
//
//            authInfo ?: return "login"

            val authInfo = AuthInfo("god", 7, "6874b3d4aa9c8473f50fa3a2a29529f2")

            var value = ordersService.setOrderStatus(authInfo.authKey, orderStatus)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777)
        }
    }
}