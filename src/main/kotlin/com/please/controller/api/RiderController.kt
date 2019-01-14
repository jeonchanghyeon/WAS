package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.RiderService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/riders")
class RiderController {
    @Autowired
    private lateinit var riderService: RiderService

    @GetMapping
    fun searchRiders(@RequestParam data: MutableMap<String, Any>,
                     @RequestParam(value = "rider-status-ids", required = false) riderStatusIds: MutableList<Int>?): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = riderService.searchList(authInfo.authKey, data, riderStatusIds)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}