package com.please.controller

import com.please.service.RidersInfoPrintService
import com.please.value.AuthInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import javax.servlet.http.HttpServletRequest

@Controller
@RequestMapping("/abc")
class RidersControlController {
    @Autowired
    private lateinit var ridersInfoPrintService: RidersInfoPrintService

    @GetMapping(value = ["efg"])
    @ResponseBody
    fun searchRiders(request: HttpServletRequest,
                     @RequestParam data: MutableMap<String, Any>,
                     @RequestParam(value = "rider-status-ids") riderStatusIds: MutableList<Int>): Any {
        val session = request.session
        val authInfo = session.getAttribute("authInfo") as AuthInfo?

        return try {
            val value = ridersInfoPrintService.infoPrint(authInfo!!.authKey, data, riderStatusIds)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}