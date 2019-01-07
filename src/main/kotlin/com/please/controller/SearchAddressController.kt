package com.please.controller

import com.please.persistence.getAuthInfo
import com.please.service.SearchAddressService
import com.please.service.ShopEnableAreaService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody

@Controller
@RequestMapping("/abce")
class SearchAddressController {
    @Autowired
    private lateinit var searchAddressService: SearchAddressService
    @Autowired
    private lateinit var enableAreaService: ShopEnableAreaService

    @GetMapping(value = ["efg"])
    @ResponseBody
    fun searchAddress(@RequestParam data: MutableMap<String, Any>): Any {
        return try {
            val value = searchAddressService.searchAddress(data)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @GetMapping(value = ["ewe"])
    @ResponseBody
    fun getEnableArea(@RequestParam data: MutableMap<String, Any>): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = enableAreaService.getEnableArea(authInfo.authKey, data)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}