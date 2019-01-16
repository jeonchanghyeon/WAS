package com.please.dataAccess

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class DistribDAO {

    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    //총판 이름과 id를 쿼리
    fun getDistributors(id: Long, group: Int): MutableList<Map<String, Any?>>? {
        var returnVal: MutableList<Map<String, Any?>>? = null
        val sql: String

        try {
            when (group) {
                7 -> {
                    sql = "SELECT u.id, ui.name FROM users as u INNER JOIN userInfos as ui ON u.id = ui.id WHERE `group` = 6 AND u.topUserId = getUserIdById(?)"
                    returnVal = template.queryForList(sql, id)
                }
                6 -> {
                    sql = "SELECT u.id, ui.name FROM users as u INNER JOIN userInfos as ui ON u.id = ui.id WHERE `group` = 6 AND u.id = ?"
                    returnVal = mutableListOf(template.queryForMap(sql, id))
                }
                in 1..5 -> {
                    sql = "SELECT u.id, ui.name FROM users as u INNER JOIN userInfos as ui ON u.id = ui.id WHERE `group` = 6 AND u.id = getTopIdById(getBranchUIdByUId(?))"
                    returnVal = mutableListOf(template.queryForMap(sql, id))
                }
            }
            println(returnVal.toString())
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return returnVal
    }
}