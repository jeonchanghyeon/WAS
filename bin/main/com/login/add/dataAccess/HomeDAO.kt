package com.login.add.dataAccess

import com.login.add.persistence.queryForJSONObject
import com.login.add.value.User
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class HomeDAO {

    @Autowired
    private lateinit var template: JdbcTemplate

    fun getUserInfo(id: String): User? {
        try {
            template.queryForRowSet("SELECT * FROM user WHERE id = ?", id).run {
                first()
                return User(
                        getString("id")?:"",
                        getString("serverName")?:"",
                        getString("address")?:""
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun addUserInfo(data: MutableMap<String, String>): Int? {
        try {
            template.update("INSERT INTO 테이블명 (id, addressSeq) VALUES (?, ?)",
                    data["id"]?:"",
                    data["serverId"]?:""
            )
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    /**
     * json 으로 값을 반환할때 사용
     */
    fun selectUserInfo(data: JSONObject): JSONObject? {
        return template.queryForJSONObject("CALL 프로시저명(?)", data.toString())
    }
}