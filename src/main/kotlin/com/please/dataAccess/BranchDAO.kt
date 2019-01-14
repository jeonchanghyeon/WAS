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
    fun getBranches(id: Long, group: Int): MutableList<Map<String, Any?>>? {
        var returnVal: MutableList<Map<String, Any?>>? = null
        val sql: String

        try {
            when (group) {
                7 -> {
                    sql = "SELECT users.id, name FROM users INNER JOIN userInfos ON users.id = userInfos.id WHERE `group` = 5 and getTopIdById(getUId(topUserId)) = ?"
                    returnVal = template.queryForList(sql, id)
                }
                6 -> {
                    sql = "SELECT u.id, ui.name FROM users as u INNER JOIN userInfos as ui ON u.id = ui.id WHERE `group` = 5 AND topUserId = getUserIdById(?)"
                    returnVal = template.queryForList(sql, id)
                }
                in 1..5 -> {
                    sql = "SELECT getBranchUIdByUId(?) as id, getUserNameById(getBranchUIdByUId(?)) as name"
                    returnVal = mutableListOf(template.queryForMap(sql, id, id))
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return returnVal
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