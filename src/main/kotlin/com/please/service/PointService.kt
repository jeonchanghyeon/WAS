package com.please.service

import com.please.dataAccess.PointDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class PointService {
    @Autowired
    private lateinit var pointDAO: PointDAO

    fun getPoint(id: Long): String {
        val jsonObject = JSONObject()
        jsonObject.put("id", id)

        return pointDAO.getPoint(jsonObject.toString())
    }
}