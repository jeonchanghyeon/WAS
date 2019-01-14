package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.BranchDAO
import com.please.dataAccess.OrderDAO
import com.please.dataAccess.StatusDAO
import com.please.value.AuthInfo
import com.please.value.Condition
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.sql.Timestamp

@Service
class SearchBranchListService {
    @Autowired
    private lateinit var branchDAO: BranchDAO

    fun getBranchs(authInfo: AuthInfo, distributeId: Long): MutableList<Map<String, Any?>>? {
        return branchDAO.getBranchs(authInfo, distributeId)
    }
}