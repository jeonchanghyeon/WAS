package com.please.dataAccess

import com.please.exception.SqlAbnormalResultException
import com.please.persistence.queryForJSONObject
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class RiderDAO {
    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    @Throws(SqlAbnormalResultException::class)
    fun searchRiderList(branchId: Long, riderInfo: String): String {
        return template.queryForJSONObject("CALL getSearchedRiders(getUserAuthKeyById(?), ?)", branchId, riderInfo)
    }

    fun getRiders(id: Long, name: String?): MutableList<Map<String, Any?>> {
        return template.queryForList("CALL getRiderListById(?)", id)
    }

    @Throws(SqlAbnormalResultException::class)
    fun getInfoInControl(authKey: String, riderInfo: String): String {
        return template.queryForJSONObject("CALL getRiderInformationInControl(?, ?)", authKey, riderInfo)
    }
}