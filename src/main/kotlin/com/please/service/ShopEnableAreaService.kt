package com.please.service

import com.please.dataAccess.AddressDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ShopEnableAreaService {
    @Autowired
    private lateinit var addressDAO: AddressDAO

    fun getEnableArea(authKey: String, data: MutableMap<String, Any>): JSONObject? {
        val shopId = data["shop-id"] as Long
        return addressDAO.getEnableDong(authKey, shopId)
    }
}