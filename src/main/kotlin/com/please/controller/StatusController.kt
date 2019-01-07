package com.please.controller

import com.please.persistence.getAuthInfo
import com.please.service.PointService
import com.please.service.StatusService
import com.please.value.Condition
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import javax.servlet.http.HttpServletRequest


@CrossOrigin(origins = arrayOf("*"), allowCredentials = "false")
@Controller
@RequestMapping("/status")
class StatusController {
    @Autowired
    private lateinit var statusService: StatusService
    @Autowired
    private lateinit var pointService: PointService

    @GetMapping
    fun status(request: HttpServletRequest, model: Model): String {
        val authInfo = getAuthInfo()!!

        var branchs = mutableListOf<Map<String, Any?>>()
        var branchSettings = JSONObject()

        var point = pointService.getPoint(authInfo.authKey)
        var distributors = statusService.getDistributors(authInfo) ?: mutableListOf()
        if (distributors.size == 1) {
            branchs = statusService.getBranchs(authInfo, distributors[0]["id"] as Long) ?: mutableListOf()
            if (branchs.size != 1) branchs.add(0, mapOf("id" to -1, "name" to "--"))
        } else {
            distributors.add(0, mapOf("id" to -1, "name" to "--"))
            branchs.add(0, mapOf("id" to -1, "name" to "--"))
        }

        model.addAttribute("point", point)
        model.addAttribute("distributors", distributors)
        model.addAttribute("branchs", branchs)
        model.addAttribute("branchSettings", branchSettings)

        return "home"
    }

    @GetMapping(value = ["orders"])
    @ResponseBody
    fun getCondition(condition: Condition): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = statusService.searchOrdersInfo(authInfo, condition)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }


    @GetMapping(value = ["distributors"])
    @ResponseBody
    fun getBranchList(@RequestParam(value = "distributorId") distributorId: Long): MutableList<Map<String, Any?>>? {
        val authInfo = getAuthInfo()!!

        var branchs = statusService.getBranchs(authInfo, distributorId) ?: mutableListOf()
        if (branchs.size != 1) {
            branchs.add(0, mapOf("id" to -1, "name" to "--"))
        }
        return branchs
    }

    @GetMapping(value = ["branch-settings/{id}"])
    @ResponseBody
    fun getBranchSettings(request: HttpServletRequest, @PathVariable id: String): Any {
        return try {
            val authInfo = getAuthInfo()!!

            var value = statusService.getBranchSettings(authInfo.authKey, id)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777)
        }
    }

    @PostMapping(value = ["branch-settings/{id}"])
    @ResponseBody
    fun setBranchSettings(request: HttpServletRequest, @RequestBody data: MutableMap<String, Any?>, @PathVariable id: String): Any {
        return try {
            val authInfo = getAuthInfo()!!
            var value = statusService.setBranchSettings(authInfo.authKey, data, id)

            println(value)

            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777)
        }
    }
}