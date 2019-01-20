package com.please.dataAccess

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

    fun searchRiderList(branchId: Long, riderInfo: JSONObject): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getSearchedRiders(getUserAuthKeyById(?), ?)", branchId, riderInfo.toString())
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun getRiders(id: Long): MutableList<Map<String, Any?>>? {
        try {
            return template.queryForList("CALL getRiderListById(?)", id)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun getInfoInControl(authKey: String, riderInfo: JSONObject): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getRiderInformationInControl(?, ?)", authKey, riderInfo.toString())
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}