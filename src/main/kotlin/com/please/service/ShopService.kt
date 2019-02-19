package com.please.service

import com.please.dataAccess.ShopDAO
import org.json.JSONArray
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*

@Service
class ShopService {
    @Autowired
    private lateinit var shopDAO: ShopDAO

    fun searchList(branchId: Long, data: MutableMap<String, Any>): String {
        val shopName: String? = data["shop-name"] as? String
        val pageIndex: Int? = (data["page-index"] as? String)?.toInt()

        val info = JSONObject()
        info.put("shopName", shopName)
        info.put("pageIndex", pageIndex)

        return shopDAO.searchShopList(branchId, info)
    }

    fun getShops(id: Long): MutableList<Map<String, Any?>> {
        return shopDAO.getShops(id)
    }

    fun getMenuList(authKey: String, shopId: Long): String {
        val menuInfo = JSONObject(shopDAO.getMenuItems(authKey, shopId))
        val result = JSONObject()
        val menuList = JSONArray()

        var tmp = menuInfo["menu"] as JSONArray
        val queue = ArrayDeque<JSONArray>()
        queue.add(tmp)

        while (queue.isNotEmpty()) {
            tmp = queue.poll()

            for (i in 0 until tmp.length()) {
                val json = tmp[i] as JSONObject

                if (!json.has("lowItems")) {
                    menuList.put(json)
                } else {
                    queue.add(json["lowItems"] as JSONArray)
                }
            }
        }

        result.put("resultCode", menuInfo["resultCode"])
        result.put("description", menuInfo["description"])
        result.put("menu", menuList)

        return result.toString()
    }
}