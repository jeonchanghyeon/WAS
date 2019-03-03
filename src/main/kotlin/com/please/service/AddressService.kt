package com.please.service

import com.please.dataAccess.AddressDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class AddressService {
    @Autowired
    private lateinit var addressDAO: AddressDAO

    fun getEnableArea(authKey: String, id: Long, consonant: Int, pageIndex: Int?): String {
        val info = JSONObject()
        info.put("id", id)
        info.put("consonant", consonant)
        info.put("pageIndex", pageIndex)
        return addressDAO.getEnableDong(authKey, info.toString())
    }

    fun searchAddress(data: MutableMap<String, Any>): String {
        val pageIndex = (data["page-index"] as? String)?.toInt()
        val address = data["address"] as String
        val category = (data["category"] as? String)!!.toInt()
        return addressDAO.getAddressList(pageIndex, address, category)
    }
}