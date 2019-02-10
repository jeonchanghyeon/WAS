package com.please.dataAccess

import com.please.exception.SqlAbnormalResultException
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
    fun getBranches(id: Long): MutableList<Map<String, Any?>> {
        return template.queryForList("CALL getBranchListById(?)", id)
    }

    @Throws(SqlAbnormalResultException::class)
    fun searchBranchList(authKey: String, condition: String): String {
        return template.queryForJSONObject("CALL getSearchedBranchByName(?, ?)", authKey, condition)
    }

    @Throws(SqlAbnormalResultException::class)
    fun getBranchSettings(authKey: String, branchId: Long): String {
        return template.queryForJSONObject("CALL getBranchSettings(?, ?)", authKey, branchId)
    }

    @Throws(SqlAbnormalResultException::class)
    fun setBranchSettings(authKey: String, jsonData: String): String {
        return template.queryForJSONObject("CALL setBranchSettings(?, ?)", authKey, jsonData)
    }
}