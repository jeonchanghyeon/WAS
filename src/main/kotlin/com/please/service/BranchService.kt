package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.BranchDAO
import com.please.value.BranchSettings
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BranchService {
    @Autowired
    private lateinit var branchDAO: BranchDAO

    fun searchList(authKey: String, branchName: String?, metro: String?, pageIndex: Int?): String {
        val info = JSONObject()
        info.put("branchName", branchName)
        info.put("metro", metro)
        info.put("pageIndex", pageIndex)
        return branchDAO.searchBranchList(authKey, info.toString())
    }

    fun getBranches(id: Long): MutableList<Map<String, Any?>> {
        return branchDAO.getBranches(id)
    }

    fun getBranchSettings(authKey: String, branchId: Long): String {
        return branchDAO.getBranchSettings(authKey, branchId)
    }

    fun setBranchSettings(authKey: String, branchSettings: BranchSettings, id: Long): String {
        return branchDAO.setBranchSettings(authKey, ObjectMapper().writeValueAsString(branchSettings))
    }
}