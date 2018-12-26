package com.please.service

import com.please.dataAccess.PointDAO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class PointService {
    @Autowired
    private lateinit var pointDAO: PointDAO

    fun getPoint(authKey: String): Int? {
        return pointDAO.getPoint(authKey)
    }
}