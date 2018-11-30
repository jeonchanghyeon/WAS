package com.login.add.controller

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

    @GetMapping
    fun status(request: HttpServletRequest, model: Model): String {
        val session = request.session
        val authInfo = session.getAttribute("authInfo") as AuthInfo?

        authInfo ?: return "login"

        var distributors = statusService.getDistributor(authInfo.id, authInfo.group) ?: listOf("")
        var branchs = listOf("")

        model.addAttribute("distributors", distributors)

        return "home"
    }

    @GetMapping(value = ["orders"])
    @ResponseBody
    fun getCondition(@RequestParam(value = "data") data: MutableMap<String, String>): Map<String, Any?> {
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
        var branchs = statusService.getBranchName(distributorNum) ?: listOf("")
        return branchs
    }
}


