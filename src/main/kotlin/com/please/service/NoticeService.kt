package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.NoticeDAO
import com.please.value.Notice
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class NoticeService {
    @Autowired
    private lateinit var noticeDAO: NoticeDAO

    fun showNoticeList(authKey: String, viewType: Int, types: MutableList<Int>, pageIndex: Int?): JSONObject? {
        val info = JSONObject()
        info.put("viewType", viewType)
        info.put("types", types)
        info.put("pageIndex", pageIndex)

        return noticeDAO.getNoticeList(authKey, info)
    }

    fun addNotice(authKey: String, notice: Notice): JSONObject? {
        return noticeDAO.insert(authKey, ObjectMapper().writeValueAsString(notice))
    }

    fun showNoticeDetail(authKey: String, noticeId: Int): JSONObject? {
        return noticeDAO.getNotice(authKey, noticeId)
    }
}