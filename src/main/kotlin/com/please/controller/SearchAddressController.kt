package com.please.controller

import com.please.service.SearchAddressService
import com.please.service.ShopsInfoPrintService
import com.please.value.AuthInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import javax.servlet.http.HttpServletRequest

@Controller
@RequestMapping("/abc")
class SearchAddressController {
    @Autowired
    private lateinit var searchAddressService: SearchAddressService

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
}