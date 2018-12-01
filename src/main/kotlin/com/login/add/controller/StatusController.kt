package com.login.add.controller

import com.login.add.service.StatusService
import com.login.add.value.AuthInfo
import com.login.add.value.Order
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

    @GetMapping
    fun status(request: HttpServletRequest, model: Model): String {
        val session = request.session
        val authInfo = session.getAttribute("authInfo") as AuthInfo?

        authInfo ?: return "login"

        val distributors = statusService.getDistributor(authInfo.id, authInfo.group) ?: listOf("")
        val resultMap = statusService.searchOrders(mutableMapOf<String, String>())

        var resultList = mutableListOf("")
        if(resultMap is Map<*,*>) {
            var map = resultMap.get("orders") as MutableMap<String, Order>

            resultList.add(map.get("id"))
            resultList.add(resultMap.get("shopId"))
            resultList.add(resultMap.get("orderStatusId"))
            resultList.add(resultMap.get("createDate"))
            resultList.add(resultMap.get("allocateDate"))
            resultList.add(resultMap.get("pickupDate"))
            resultList.add(resultMap.get("completeDate"))
            resultList.add(resultMap.get("cancelDate"))
            resultList.add(resultMap.get("deliveryCost"))
            resultList.add(resultMap.get("additionalCost"))
            resultList.add(resultMap.get("riderId"))
            resultList.add(resultMap.get("paymentType"))
            resultList.add(resultMap.get("memo"))

        } else resultList = resultMap as List<String>

        var branchs = listOf("")

        model.addAttribute("distributors", distributors)
        model.addAttribute("resultList", resultList)
        return "home"
    }

    @GetMapping(value = ["orders"])
    @ResponseBody
    fun getCondition(@RequestParam data: MutableMap<String, String>): Map<String, Any?> {
        return try {
            var value = statusService.searchOrders(data)
            mapOf("resultCode" to 0, "resultObject" to value)
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @GetMapping(value = ["distributors"])
    @ResponseBody
    fun getBranchList(@RequestParam(value = "distributorNum") distributorNum: String): List<String>? {
        if(distributorNum.equals("--")) return null
        val branchs = statusService.getBranchName(distributorNum) ?: listOf("")
        return branchs
    }
}


