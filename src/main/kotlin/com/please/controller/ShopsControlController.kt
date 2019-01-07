package com.please.controller

import com.please.persistence.getAuthInfo
import com.please.service.ShopsInfoPrintService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody

@Controller
@RequestMapping("/shop-control")
class ShopsControlController {
    @Autowired
    private lateinit var shopsInfoPrintService: ShopsInfoPrintService

    @GetMapping(value = ["shops"])
    @ResponseBody
    fun searchShops(@RequestParam data: MutableMap<String, Any>,
                    @RequestParam(value = "shop-status-ids") shopStatusIds: MutableList<Int>): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = shopsInfoPrintService.infoPrint(authInfo.authKey, data, shopStatusIds)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}