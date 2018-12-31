package com.please.service

import com.please.dataAccess.RidersManagementDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RidersInfoPrintService {
    @Autowired
    private lateinit var riderManagementDAO: RidersManagementDAO

    fun infoPrint(authKey: String, data: MutableMap<String, Any>, riderStatusIds: MutableList<Int>): JSONObject? {
        val riderName: String? = data["rider-name"] as String?

        val info = JSONObject()
        info.put("riderName", riderName)
        info.put("riderStatusIds", riderStatusIds)
        info.put("pageIndex", data["page-index"] as Long?)

        return riderManagementDAO.searchRiders(authKey, info)
    }
}