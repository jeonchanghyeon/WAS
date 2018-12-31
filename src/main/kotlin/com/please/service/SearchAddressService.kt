package com.please.service

import com.please.dataAccess.AddressDAO
import com.please.dataAccess.RidersManagementDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class SearchAddressService {
    @Autowired
    private lateinit var addressDAO: AddressDAO

    fun searchAddress(data: MutableMap<String, Any>): JSONObject? {
        val pageIndex = data["page-index"] as Int
        val address = data["address"] as String
        val category = data["category"] as Int

        return addressDAO.getAddressList(pageIndex, address, category)
    }
}