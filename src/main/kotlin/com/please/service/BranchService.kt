package com.please.service

import com.please.dataAccess.BranchDAO
import com.please.value.AuthInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BranchService {
    @Autowired
    private lateinit var branchDAO: BranchDAO

    fun getBranchs(authInfo: AuthInfo, distributeId: Long): MutableList<Map<String, Any?>>? {
        return branchDAO.getBranchs(authInfo, distributeId)
    }
}