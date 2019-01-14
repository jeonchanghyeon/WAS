package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.DistributorDAO
import com.please.dataAccess.OrderDAO
import com.please.dataAccess.StatusDAO
import com.please.value.AuthInfo
import com.please.value.Condition
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.sql.Timestamp

@Service
class SearchDistributorListService {
    @Autowired
    private lateinit var distributorDAO: DistributorDAO

    fun getDistributors(authInfo: AuthInfo): MutableList<Map<String, Any?>>? {
        return distributorDAO.getDistributor(authInfo)
    }
}