package com.please.controller

import com.please.persistence.getAuthInfo
import com.please.service.AddNoticeService
import com.please.service.ShowNoticeListService
import com.please.service.ShowNoticeService
import com.please.value.Notice
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import javax.servlet.http.HttpServletRequest

@Controller
@RequestMapping("/notices")
class NoticesController {
    @Autowired
    private lateinit var showNoticeListService: ShowNoticeListService
    @Autowired
    private lateinit var showNoticeService: ShowNoticeService
    @Autowired
    private lateinit var addNoticeService: AddNoticeService

    @GetMapping
    fun notice(request: HttpServletRequest, model: Model): String {
        return "notice"
    }

    @RequestMapping(value = ["all"], method = [RequestMethod.GET])
    @ResponseBody
    fun showNoticeList(@RequestParam(value = "types", required = true) types: MutableList<Int>,
                       @RequestParam(value = "page-index", required = false) pageIndex: Int?): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = showNoticeListService.showList(authInfo.authKey, types, pageIndex)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @RequestMapping(method = [RequestMethod.POST])
    @ResponseBody
    fun addNotice(@RequestBody notice: Notice): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = addNoticeService.addNotice(authInfo.authKey, notice)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @RequestMapping(value = ["noticeId"], method = [RequestMethod.GET])
    @ResponseBody
    fun showNotice(@PathVariable noticeId: Int): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = showNoticeService.showNotice(authInfo.authKey, noticeId)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}