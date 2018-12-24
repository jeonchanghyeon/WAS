package com.login.add.controller

import com.login.add.service.OrderInfoSend
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
@RequestMapping("/order-details")
class OrderDetailsController {
    @Autowired
    private lateinit var orderInfoSend: OrderInfoSend

    @GetMapping(value=["info"])
    @ResponseBody
    fun orderInfo
}