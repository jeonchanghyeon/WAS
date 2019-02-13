package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.PointService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/point")
class PointController {
    @Autowired
    private lateinit var pointService: PointService

    /*
        return -> {
            "resultCode", "description",
            "point": { "point" }
        }
     */
    @GetMapping
    fun showPoint(): Any {
        val authInfo = getAuthInfo()
        return pointService.getPoint(authInfo.id)
    }

    @RequestMapping(value = ["{id}"], method = [RequestMethod.POST])
    fun sendPoint(@PathVariable(value = "id") receiverId: Long, @RequestBody pointMap: MutableMap<String, Int>): String {
        val authInfo = getAuthInfo()
        return pointService.sendPoint(authInfo.authKey, receiverId, pointMap["point"]!!)
    }
}