package com.login.add.controller

import com.login.add.service.PointService
import com.login.add.service.StatusService
import com.login.add.value.AuthInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import javax.servlet.http.HttpServletRequest


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

        var distributors = statusService.getDistributor(authInfo.id, authInfo.group) ?: listOf("")
        var branchs = statusService.getBranchName(authInfo.id, authInfo.group) ?: listOf("")
        var point = pointService.getPoint(authInfo.id)

        model.addAttribute("distributors", distributors)
        model.addAttribute("branchs", branchs)
        model.addAttribute("point", point)

        return "home"
    }

    @GetMapping(value = ["orders"])
    @ResponseBody
    fun gerCondition(@RequestParam data: MutableMap<String, String>): Map<String, Any?> {
        return try {
            var value = statusService.searchOrders(data)
            mapOf("resultCode" to 0, "resultObject" to value)
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}