package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.PointService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/point")
class PointController {
    @Autowired
    private lateinit var pointService: PointService

    @GetMapping
    fun showPoint(): Any {
        return try {
            val authInfo = getAuthInfo()!!
            pointService.getPoint(authInfo.authKey)!!
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}