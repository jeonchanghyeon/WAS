package com.please.service

import com.please.dataAccess.ShopDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ShopsInfoPrintService {
    @Autowired
    private lateinit var shopDAO: ShopDAO

    fun infoPrint(authKey: String, data: MutableMap<String, Any>, shopStatusIds: MutableList<Int>): JSONObject? {
        val shopName: String? = data["shop-name"] as String?

        val info = JSONObject()
        info.put("shopName", shopName)
        info.put("shopStatusIds", shopStatusIds)
        info.put("pageIndex", data["page-index"] as Long?)

        return shopDAO.searchShopList(authKey, info)
    }
}