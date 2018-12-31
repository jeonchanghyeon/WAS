package com.please.service

import com.please.dataAccess.OrderReceiptDAO
import com.please.dataAccess.RidersManagerDAO
import com.please.value.ReceiptInfo
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RidersInfoPrintService {
    @Autowired
    private lateinit var riderManagerDAO: RidersManagerDAO

    fun infoPrint(authKey: String, data: MutableMap<String, Any>, riderStatusIds: MutableList<Int>): JSONObject? {
        val riderName = data["rider-name"]

        val info = JSONObject()
        info.put("riderName", riderName)
        info.put("riderStatusIds", riderStatusIds)

        return riderManagerDAO.searchRiders(authKey, info)
    }
}