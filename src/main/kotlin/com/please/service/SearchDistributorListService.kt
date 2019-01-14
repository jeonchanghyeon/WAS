package com.please.service

import com.please.dataAccess.DistribDAO
import com.please.value.AuthInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class SearchDistributorListService {
    @Autowired
    private lateinit var distribDAO: DistribDAO

    fun getDistributors(authInfo: AuthInfo): MutableList<Map<String, Any?>>? {
        return distribDAO.getDistributor(authInfo)
    }
}