package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.NoticeService
import com.please.value.Notice
import com.please.value.NoticeCondition
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
    fun showNoticeList(noticeCondition: NoticeCondition): Any {
        /* view-type : 5 -> 지사 공지 확인, 6 -> 총판 공지 확인, 7 -> 본사 공지 확인
         * view-groups == user-group
         *  */
        val authInfo = getAuthInfo()
        return noticeService.showNoticeList(authInfo.authKey, noticeCondition)
    }

    @RequestMapping(method = [RequestMethod.PUT])
    fun addNotice(@RequestBody notice: Notice): Any {
        val authInfo = getAuthInfo()
        return noticeService.addNotice(authInfo.authKey, notice)
    }

    /*
        return ->
            {"resultCode":, "description":,
             "notice": {
                            "id",
                            "userGroup",
                            "title",
                            "content",
                            "writerName",
                            "createDate"
                       }
            }
     */
    @GetMapping(value = ["{notice-id}"])
    fun showNotice(@PathVariable(value = "notice-id") noticeId: Int): Any {
        val authInfo = getAuthInfo()
        return noticeService.showNoticeDetail(authInfo.authKey, noticeId)
    }

    @RequestMapping(value = ["{notice-id}"], method = [RequestMethod.POST])
    fun updateNotice(@PathVariable(value = "notice-id") noticeId: Long,
                     @RequestBody notice: Notice): Any {
        val authInfo = getAuthInfo()
        notice.id = noticeId
        return noticeService.updateNotice(authInfo.authKey, notice)
    }

    @RequestMapping(value = ["{notice-id}"], method = [RequestMethod.DELETE])
    fun deleteNotice(@PathVariable(value = "notice-id") noticeId: Long): Any {
        val authInfo = getAuthInfo()
        return noticeService.deleteNotice(authInfo.authKey, noticeId)
    }
}