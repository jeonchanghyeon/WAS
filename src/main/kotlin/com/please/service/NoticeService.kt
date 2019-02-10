package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.NoticeDAO
import com.please.value.Notice
import com.please.value.NoticeCondition
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class NoticeService {
    @Autowired
    private lateinit var noticeDAO: NoticeDAO

    fun showNoticeList(authKey: String, condition: NoticeCondition): String {
        return noticeDAO.getNoticeList(authKey, ObjectMapper().writeValueAsString(condition).toString())
    }

    fun addNotice(authKey: String, notice: Notice): String {
        return noticeDAO.insert(authKey, ObjectMapper().writeValueAsString(notice))
    }

    fun showNoticeDetail(authKey: String, noticeId: Int): String {
        return noticeDAO.getNotice(authKey, noticeId)
    }

    fun updateNotice(authKey: String, notice: Notice): String {
        return noticeDAO.update(authKey, ObjectMapper().writeValueAsString(notice))
    }

    fun deleteNotice(authKey: String, noticeId: Long): String {
        val info = JSONObject()
        info.put("id", noticeId)
        return noticeDAO.delete(authKey, info.toString())
    }
}