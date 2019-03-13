package com.please.controller.api

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.persistence.getAuthInfo
import com.please.service.PointService
import com.please.value.WithdrawInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate


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

    @RequestMapping(value = ["{id}"], method = [RequestMethod.PUT])
    fun sendPoint(@PathVariable(value = "id") receiverId: Long, @RequestBody data: MutableMap<String, Any>): Any {
        val authInfo = getAuthInfo()
        return pointService.sendPoint(authInfo.authKey, authInfo.id, receiverId, (data["point"] as String).toInt(), data["point-password"] as String)
    }

    @RequestMapping(method = [RequestMethod.POST])
    fun withdraw(@RequestBody withdrawInfo: WithdrawInfo): Any {
        val authInfo = getAuthInfo()
        val restTemplate = RestTemplate()

        println(ObjectMapper().writeValueAsString(withdrawInfo))
        val uriTemplate = "http://54.180.79.53:8080/firmBanking/withdraw"
        withdrawInfo.id = authInfo.id
        withdrawInfo.authKey = authInfo.authKey
        withdrawInfo.commission = 300

        return restTemplate.postForObject(uriTemplate, ObjectMapper().writeValueAsString(withdrawInfo), String::class.java)
    }
}