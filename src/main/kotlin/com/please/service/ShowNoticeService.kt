package com.please.service

import com.please.dataAccess.NoticeDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ShowNoticeService {
    @Autowired
    private lateinit var noticeDAO: NoticeDAO

    fun showNotice(authKey: String, noticeId: Int): JSONObject? {
        return noticeDAO.getNotice(authKey, noticeId)
    }
}