package com.please.service

import com.please.dataAccess.NoticeDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ShowNoticeListService {
    @Autowired
    private lateinit var noticeDAO: NoticeDAO

    fun showList(authKey: String, types: MutableList<Int>, pageIndex: Int?): JSONObject? {
        val info = JSONObject()
        if (types.size == 1) info.put("type", types[0])
        else info.put("types", types)
        info.put("pageIndex", pageIndex)
        println("service : ${info}")
        return noticeDAO.getNoticeList(authKey, info)
    }
}