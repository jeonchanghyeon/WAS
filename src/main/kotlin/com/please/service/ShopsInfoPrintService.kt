package com.please.service

import com.please.dataAccess.ShopsManagementDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ShopsInfoPrintService {
    @Autowired
    private lateinit var shopManagementDAO: ShopsManagementDAO

    fun infoPrint(authKey: String, data: MutableMap<String, Any>, shopStatusIds: MutableList<Int>): JSONObject? {
        val shopName: String? = data["shop-name"] as String?

        val info = JSONObject()
        info.put("shopName", shopName)
        info.put("shopStatusIds", shopStatusIds)
        info.put("pageIndex", data["page-index"] as Long?)

        return shopManagementDAO.searchShops(authKey, info)
    }
}