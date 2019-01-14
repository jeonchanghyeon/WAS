package com.please.service

import com.please.dataAccess.RiderDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RiderService {
    @Autowired
    private lateinit var riderDAO: RiderDAO

    fun searchList(branchId: Long, data: MutableMap<String, Any>): JSONObject? {
        val riderName: String? = data["rider-name"] as? String
        val pageIndex: Long? = (data["page-index"] as? String)?.toLong()

        val info = JSONObject()
        info.put("riderName", riderName)
        info.put("pageIndex", pageIndex)

        return riderDAO.searchRiderList(branchId, info)
    }

    fun getRiders(id: Long, group: Int): MutableList<Map<String, Any?>>? {
        return riderDAO.getRiders(id, group)
    }
}