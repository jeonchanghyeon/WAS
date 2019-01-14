package com.please.dataAccess

import com.please.value.AuthInfo
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
}