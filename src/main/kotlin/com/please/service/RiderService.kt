package com.please.service

import com.please.dataAccess.RiderDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RiderService {
    @Autowired
    private lateinit var riderDAO: RiderDAO

    fun searchList(authKey: String, data: MutableMap<String, Any>, riderStatusIds: MutableList<Int>?): JSONObject? {
        val riderName: String? = data["rider-name"] as? String
        val pageIndex: Long? = (data["page-index"] as? String)?.toLong()

        val info = JSONObject()
        info.put("riderName", riderName)
        info.put("riderStatusIds", riderStatusIds)
        info.put("pageIndex", pageIndex)

        return riderDAO.searchRiderList(authKey, info)
    }
}