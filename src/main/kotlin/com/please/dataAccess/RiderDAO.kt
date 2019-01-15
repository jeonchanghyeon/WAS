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

    fun getRiders(id: Long, group: Int): MutableList<Map<String, Any?>>? {
        var returnVal: MutableList<Map<String, Any?>>? = null
        val sql: String

        try {
            when (group) {
                7 -> {
                    sql = "SELECT u.id, ui.name FROM users as u INNER JOIN userInfos as ui ON u.id = ui.id WHERE `group` = 2 and getTopIdById(getTopIdById(getUId(topUserId))) = ?"
                    returnVal = template.queryForList(sql, id)
                }
                6 -> {
                    sql = "SELECT u.id, ui.name FROM users as u INNER JOIN userInfos as ui ON u.id = ui.id WHERE `group` = 2 and getTopIdById(getUId(topUserId)) = ?"
                    returnVal = template.queryForList(sql, id)
                }
                5 -> {
                    sql = "SELECT u.id, ui.name FROM users as u INNER JOIN userInfos as ui ON u.id = ui.id WHERE `group` = 2 and getUId(topUserId) = ?"
                    returnVal = template.queryForList(sql, id)
                }
                2 -> {
                    sql = "SELECT ? as id, getUserNameById(?) as name"
                    returnVal = mutableListOf(template.queryForMap(sql, id, id))
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return returnVal
    }
}