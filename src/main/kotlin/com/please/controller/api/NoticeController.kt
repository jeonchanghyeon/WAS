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

    /*
        return ->
            {"resultCode":, "description":,
             "notices": { [
                                "id",
                                "title",
                                "content",
                                "writerName",
                                "createDate"
                           ], [,,], ....}
            }
     */
    @GetMapping
    fun showNoticeList(@RequestParam(value = "view-type") viewType: Int,
                       @RequestParam(value = "writer-id", required = false) writerId: Long?,
                       @RequestParam(value = "view-groups") viewGroups: MutableList<Int>,
                       @RequestParam(value = "page-index", required = false) pageIndex: Int?): Any {
        /* view-type : 5 -> 지사 공지 확인, 6 -> 총판 공지 확인, 7 -> 본사 공지 확인
         * view-groups == user-group
         *  */
        return try {
            val authInfo = getAuthInfo()!!
            val value = noticeService.showNoticeList(authInfo.authKey, viewType, writerId, viewGroups, pageIndex)
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
            println("message: " + e.message)
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    /*
        return ->
            {"resultCode":, "description":,
             "notice": {
                            "id",
                            "title",
                            "content",
                            "writerName",
                            "createDate"
                       }
            }
     */
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

    @RequestMapping(value = ["{notice-id}"], method = [RequestMethod.POST])
    fun updateNotice(@PathVariable(value = "notice-id") noticeId: Long,
                     notice: Notice): Any {
        return try {
            val authInfo = getAuthInfo()!!
            notice.id = noticeId
            val value = noticeService.updateNotice(authInfo.authKey, notice)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @RequestMapping(value = ["{notice-id}"], method = [RequestMethod.DELETE])
    fun deleteNotice(@PathVariable(value = "notice-id") noticeId: Long): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = noticeService.deleteNotice(authInfo.authKey, noticeId)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}