package com.please.dataAccess

import com.please.persistence.queryForJSONObject
import com.please.value.AuthInfo
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.Timestamp

@Repository
class StatusDAO {

    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    //총판 이름과 id를 쿼리
    fun getDistributor(authInfo: AuthInfo): MutableList<Map<String, Any?>>? {
        var returnVal: MutableList<Map<String, Any?>>? = null

        try {
            val sql = "SELECT users.id, name FROM users INNER JOIN userInfos ON users.id = userInfos.id WHERE `group` = 6"
            returnVal = mutableListOf(template.queryForMap(sql))
            println(returnVal.toString())
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return returnVal
    }

    //지사 id와 이름 목록 쿼리
    fun getBranchs(authInfo: AuthInfo, distributorId: Long): MutableList<Map<String, Any?>>? {
        var returnVal: MutableList<Map<String, Any?>>? = null

        try {
            when (authInfo.group) {
                in 6..7 -> {
                    val sql = "SELECT users.id, name FROM users INNER JOIN userInfos ON users.id = userInfos.id WHERE `group` = 5 and topUserId = getUserIdById(?)"
                    returnVal = template.queryForList(sql, distributorId)
                }
                in 1..5 -> {
                    val sql = "SELECT getBranchUIdByUserId('?') as id, getUserNameById(getBranchUIdByUserId('?')) as name"
                    returnVal = mutableListOf(template.queryForMap(sql, authInfo.id, authInfo.id))
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