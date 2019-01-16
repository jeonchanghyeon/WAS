package com.please.dataAccess

import com.please.persistence.queryForJSONObject
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class BranchDAO {

    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    //지사 id와 이름 목록 쿼리
    fun getBranches(id: Long): MutableList<Map<String, Any?>>? {
        try {
            return template.queryForList("CALL getBranchListById(?)", id)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun getBranchSettings(authKey: String, branchId: String): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getBranchSettings(?, ?)", authKey, branchId)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun setBranchSettings(branchId: String, jsonData: String): JSONObject? {
        try {
            return template.queryForJSONObject("CALL setBranchSettings(?, ?)", branchId, jsonData)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}