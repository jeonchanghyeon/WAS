package com.please.controller

import com.please.persistence.getAuthInfo
import com.please.service.PointService
import com.please.service.SearchBranchListService
import com.please.service.SearchDistributorListService
import com.please.service.StatusService
import com.please.value.Condition
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import javax.servlet.http.HttpServletRequest

@Controller
@RequestMapping("/statuses")
class StatusController {
    @Autowired
    private lateinit var statusService: StatusService
    @Autowired
    private lateinit var pointService: PointService
    @Autowired
    private lateinit var searchBranchListService: SearchBranchListService
    @Autowired
    private lateinit var searchDistributorListService: SearchDistributorListService

    @GetMapping
    fun status(model: Model): String {
        val authInfo = getAuthInfo()!!

        var branchs = mutableListOf<Map<String, Any?>>()
        var branchSettings = JSONObject()

        var point = pointService.getPoint(authInfo.authKey)
        var distributors = searchDistributorListService.getDistributors(authInfo) ?: mutableListOf()
        if (distributors.size == 1) {
            branchs = searchBranchListService.getBranchs(authInfo, distributors[0]["id"] as Long) ?: mutableListOf()
            if (branchs.size != 1) branchs.add(0, mapOf("id" to -1, "name" to "--"))
        } else {
            distributors.add(0, mapOf("id" to -1, "name" to "--"))
            branchs.add(0, mapOf("id" to -1, "name" to "--"))
        }

        model.addAttribute("point", point)
        model.addAttribute("distributors", distributors)
        model.addAttribute("branchs", branchs)
        model.addAttribute("branchSettings", branchSettings)

        when(authInfo.group) {
            7 -> {
                return "status_head"
            }
            6 -> {
                return "status_distrib"
            }
            in 4..5 -> {
                return "status_branch"
            }
            3 -> {
                return "status_shop"
            }
            2 -> {
                return "status_rider"
            }
        }
        return ""
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

        var branchs = searchBranchListService.getBranchs(authInfo, distributorId) ?: mutableListOf()
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