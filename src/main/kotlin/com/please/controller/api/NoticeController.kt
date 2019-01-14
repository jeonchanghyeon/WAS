package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.NoticeService
import com.please.value.Notice
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/notices")
class NoticeController {
    @Autowired
    private lateinit var noticeService: NoticeService

    @GetMapping
    fun showNoticeList(@RequestParam(value = "types", required = true) types: MutableList<Int>,
                       @RequestParam(value = "page-index", required = false) pageIndex: Int?): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = noticeService.showNoticeList(authInfo.authKey, types, pageIndex)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @RequestMapping(method = [RequestMethod.POST])
    fun addNotice(@RequestBody notice: Notice): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = noticeService.addNotice(authInfo.authKey, notice)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @GetMapping(value = ["notice-id"])
    fun showNotice(@PathVariable(value = "notice-id") noticeId: Int): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = noticeService.showNoticeDetail(authInfo.authKey, noticeId)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}