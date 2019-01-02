package com.please.controller

import com.please.service.ShopsInfoPrintService
import com.please.value.AuthInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import javax.servlet.http.HttpServletRequest

@Controller
@RequestMapping("/shop-control")
class ShopsControlController {
    @Autowired
    private lateinit var shopsInfoPrintService: ShopsInfoPrintService

    @GetMapping(value = ["efg"])
    @ResponseBody
    fun searchShops(request: HttpServletRequest,
                    @RequestParam data: MutableMap<String, Any>,
                    @RequestParam(value = "shop-status-ids") shopStatusIds: MutableList<Int>): Any {
        val session = request.session
        val authInfo = session.getAttribute("authInfo") as AuthInfo?

        return try {
            val value = shopsInfoPrintService.infoPrint(authInfo!!.authKey, data, shopStatusIds)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}