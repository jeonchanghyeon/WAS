package com.login.add.controller

import com.login.add.service.PointService
import com.login.add.service.StatusService
import com.login.add.value.AuthInfo
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
        val session = request.session
        val authInfo = session.getAttribute("authInfo") as AuthInfo?

        authInfo ?: return "login"

        var branchs = mutableListOf<Map<String, Any?>>()

        var point = pointService.getPoint(authInfo.authKey)
        var distributors = statusService.getDistributors(authInfo) ?: mutableListOf()
        if(distributors.size == 1) {
            branchs = statusService.getBranchs(authInfo, distributors[0]["id"] as Int) ?: mutableListOf()
        }
        else {
            distributors.add(0, mapOf("id" to -1, "name" to "--"))
            if(branchs.size != 1) branchs.add(0, mapOf("id" to -1, "name" to "--"))
        }

        model.addAttribute("point", point)
        model.addAttribute("distributors", distributors)
        model.addAttribute("branchs", branchs)
        return "home"
    }

    @GetMapping(value = ["orders"])
    @ResponseBody
    fun getCondition(
            @RequestParam data: MutableMap<String, Any>,
            @RequestParam(value = "payment_type") paymentType: Array<Boolean>,
            @RequestParam(value = "service_type") serviceType: Array<Boolean>)
            : Map<String, Any?> {
        return try {
            var value = statusService.searchOrders(data, paymentType, serviceType)
            println(value)
            mapOf("resultCode" to 0, "resultObject" to value)
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @GetMapping(value = ["distributors"])
    @ResponseBody
    fun getBranchList(request: HttpServletRequest, @RequestParam(value = "distributorId") distributorId: Int): MutableList<Map<String, Any?>>? {
        val session = request.session
        val authInfo = session.getAttribute("authInfo") as AuthInfo?
        var resultCode: Int

        var branchs = statusService.getBranchs(authInfo!!, distributorId) ?: mutableListOf()
        if(branchs.size != 1) {
            branchs.add(0, mapOf("id" to -1, "name" to "--"))
        }
        return branchs
    }

    @PostMapping(value = ["branch-settings/{id}"])
    @ResponseBody
    fun setBranchSettings(request: HttpServletRequest, @RequestBody data: MutableMap<String, Any?>, @PathVariable id: String): Map<String, Any?> {
        val session = request.session
        val authInfo = session.getAttribute("authInfo") as AuthInfo?
        var resultCode: Int

        return try {
            resultCode = statusService.setBranchSettings(authInfo!!.authKey, data, id)
            mapOf("resultCode" to resultCode)
        } catch(e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777)
        }
    }
}