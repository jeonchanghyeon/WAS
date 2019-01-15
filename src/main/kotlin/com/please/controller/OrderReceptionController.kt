package com.please.controller

import com.please.persistence.getAuthInfo
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/order-reception")
class OrderReceptionController {
    @GetMapping
    fun showAcceptOrder(): String {
        val authInfo = getAuthInfo()!!
        when (authInfo.group) {
            7 -> {
                return "order_reception/reception_head"
            }
            6 -> {
                return "order_reception/reception_distrib"
            }
            in 4..5 -> {
                return "order_reception/reception_branch"
            }
            3 -> {
                return "order_reception/reception_shop"
            }
        }
        return "login"
    }
}