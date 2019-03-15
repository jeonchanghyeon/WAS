package com.please.service

import com.please.dataAccess.DistribDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DistribService {
    @Autowired
    private lateinit var distribDAO: DistribDAO

    fun getDistributors(id: Long, name: String?): MutableList<Map<String, Any?>> {
        val info = JSONObject()
        info.put("id", id)
        info.put("name", name)
        return distribDAO.getDistributors(info.toString())
    }
}