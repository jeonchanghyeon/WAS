package com.please.service

import com.please.dataAccess.ShopDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ShopService {
    @Autowired
    private lateinit var shopDAO: ShopDAO

    fun infoPrint(authKey: String, data: MutableMap<String, Any>): JSONObject? {
        val shopName: String? = data["shop-name"] as? String
        val pageIndex: Long? = (data["page-index"] as? String)?.toLong()

        val info = JSONObject()
        info.put("shopName", shopName)
        info.put("pageIndex", pageIndex)

        return shopDAO.searchShopList(authKey, info)
    }
}