package com.please.service

import com.please.dataAccess.AddressDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class AddressService {
    @Autowired
    private lateinit var addressDAO: AddressDAO

    fun getEnableArea(authKey: String, data: MutableMap<String, Any>): JSONObject? {
        val shopId = data["shop-id"] as Long
        return addressDAO.getEnableDong(authKey, shopId)
    }

    fun searchAddress(data: MutableMap<String, Any>): JSONObject? {
        val pageIndex = data["page-index"] as Int
        val address = data["address"] as String
        val category = data["category"] as Int
        return addressDAO.getAddressList(pageIndex, address, category)
    }
}