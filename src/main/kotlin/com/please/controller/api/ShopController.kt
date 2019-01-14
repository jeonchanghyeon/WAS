package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.ShopService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/shops")
class ControlsController {
    @Autowired
    private lateinit var shopService: ShopService

    @GetMapping
    fun searchShops(@RequestParam data: MutableMap<String, Any>): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = shopService.searchList(authInfo.authKey, data)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}