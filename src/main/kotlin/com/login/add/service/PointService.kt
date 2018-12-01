package com.login.add.service

import com.login.add.dataAccess.PointDAO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class PointService {
    @Autowired
    private lateinit var pointDAO: PointDAO

    fun getPoint(userId: String) : Int? {
        return pointDAO.getPoint(userId)
    }
}