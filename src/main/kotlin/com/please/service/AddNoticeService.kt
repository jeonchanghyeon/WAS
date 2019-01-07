package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.NoticeDAO
import com.please.value.Notice
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class AddNoticeService {
    @Autowired
    private lateinit var noticeDAO: NoticeDAO

    fun addNotice(authKey: String, notice: Notice): JSONObject? {
        return noticeDAO.insert(authKey, ObjectMapper().writeValueAsString(notice))
    }
}