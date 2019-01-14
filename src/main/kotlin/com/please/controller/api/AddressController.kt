package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.AddressService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/address")
class AddressController {
    private lateinit var addressService: AddressService

    @GetMapping
    fun searchAddress(@RequestParam data: MutableMap<String, Any>): Any {
        return try {
            val value = addressService.searchAddress(data)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @GetMapping(value = ["enable-dong"])
    fun getEnableArea(@RequestParam data: MutableMap<String, Any>): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = addressService.getEnableArea(authInfo.authKey, data)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}