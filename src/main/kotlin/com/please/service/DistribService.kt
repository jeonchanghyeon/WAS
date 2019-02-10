package com.please.service

import com.please.dataAccess.DistribDAO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DistribService {
    @Autowired
    private lateinit var distribDAO: DistribDAO

    fun getDistributors(id: Long): MutableList<Map<String, Any?>> {
        return distribDAO.getDistributors(id)
    }
}