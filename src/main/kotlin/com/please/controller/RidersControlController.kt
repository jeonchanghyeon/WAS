package com.please.controller

import com.please.persistence.getAuthInfo
import com.please.service.RidersInfoPrintService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody

@Controller
@RequestMapping("/rider-control")
class RidersControlController {
    @Autowired
    private lateinit var ridersInfoPrintService: RidersInfoPrintService

    @GetMapping
    fun show(): String {
        return "rider_control"
    }

    @GetMapping(value = ["riders"])
    @ResponseBody
    fun searchRiders(@RequestParam data: MutableMap<String, Any>,
                     @RequestParam(value = "rider-status-ids", required = false) riderStatusIds: MutableList<Int>?): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = ridersInfoPrintService.infoPrint(authInfo.authKey, data, riderStatusIds)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}