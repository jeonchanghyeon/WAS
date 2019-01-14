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
    fun searchRiders(@RequestParam(value = "branch-id") branchId: Long,
                     @RequestParam data: MutableMap<String, Any>): Any {
        /* rider-name, page-index */
        return try {
            val value = riderService.searchList(branchId, data)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @GetMapping
    fun getRiderList(@RequestParam id: Long,
                    @RequestParam group: Int): MutableList<Map<String, Any?>>? {
        val riders = riderService.getRiders(id, group) ?: mutableListOf()
        if (riders.size != 1) {
            riders.add(0, mapOf("id" to -1, "name" to "--"))
        }
        return riders
    }
}