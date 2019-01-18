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
    fun showNoticeList(@RequestParam(value = "view-type") viewType: Int,
                       @RequestParam(value = "types") types: MutableList<Int>,
                       @RequestParam(value = "page-index", required = false) pageIndex: Int?): Any {
        /* view-type : 5 -> 지사 공지 확인, 6 -> 총판 공지 확인, 7 -> 본사 공지 확인
         * types : 1 -> 본사만, 2 -> 총판만, 3 -> 지사만, 4 -> 상점만, 5 -> 기사만
         *  */
        return try {
            val authInfo = getAuthInfo()!!
            val value = noticeService.showNoticeList(authInfo.authKey, viewType, types, pageIndex)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @RequestMapping(method = [RequestMethod.PUT])
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

    @GetMapping(value = ["{notice-id}"])
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