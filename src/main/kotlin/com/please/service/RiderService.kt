package com.please.service

import com.please.dataAccess.RiderDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RiderService {
    @Autowired
    private lateinit var riderDAO: RiderDAO

    fun searchList(branchId: Long, data: MutableMap<String, Any>): String {
        val riderName: String? = data["rider-name"] as? String
        val riderStatusId: Int? = (data["rider-status-id"] as? String)?.toInt()
        val pageIndex: Int? = (data["page-index"] as? String)?.toInt()

        val info = JSONObject()
        info.put("riderName", riderName)
        info.put("riderStatusId", riderStatusId)
        info.put("pageIndex", pageIndex)

        return riderDAO.searchRiderList(branchId, info.toString())
    }

    fun getRiders(id: Long): MutableList<Map<String, Any?>> {
        return riderDAO.getRiders(id)
    }

    fun getInfoInControl(authKey: String, riderId: Long, startDate: String?, endDate: String?): String {
        val info = JSONObject()
        info.put("id", riderId)
        info.put("startDate", startDate)
        info.put("endDate", endDate)
        return riderDAO.getInfoInControl(authKey, info.toString())
    }
}