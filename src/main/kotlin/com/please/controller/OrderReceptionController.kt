package com.please.controller

import com.please.exception.GroupNotFoundException
import com.please.persistence.getAuthInfo
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/order-reception")
class OrderReceptionController {
    @GetMapping
    fun showOrderReception(model: Model): String {
        val authInfo = getAuthInfo()
        model.addAttribute("id", authInfo.id)

        return when (authInfo.group) {
            in 5..7 -> {
                "order_reception/reception_head"
            }
            3 -> {
                "order_reception/reception_head"
            }
            else -> {
                throw GroupNotFoundException("Order reception page load failed. (group = ${authInfo.group})")
            }
        }
    }
}