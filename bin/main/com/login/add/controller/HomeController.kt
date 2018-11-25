package com.login.add.controller

import com.login.add.service.HomeService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
class HomeController {

    @Autowired
    private lateinit var homeService: HomeService

    @RequestMapping(value = ["/home"], method = [RequestMethod.GET])
    fun home(): String {
        return "home"
    }

    @RequestMapping(value = ["/home/get/{id}"], method = [RequestMethod.GET])
    @ResponseBody
    fun getData(@PathVariable id: String): Map<String, Any?> {
        return try {
            val value = homeService.getUserInfo(id)
            mapOf("resultCode" to 0, "user" to value)
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @RequestMapping(value = ["/home/add"], method = [RequestMethod.POST])
    @ResponseBody
    fun insert(@RequestParam data: MutableMap<String, String>): Map<String, Any?> {
        return try {
            homeService.insertUserInfo(data)
            mapOf("resultCode" to 0)
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}