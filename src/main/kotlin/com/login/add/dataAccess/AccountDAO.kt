package com.login.add.dataAccess

import com.login.add.value.AccountInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.Date

@Repository
class AccountDAO {

    @Autowired
    private lateinit var template: JdbcTemplate

    fun getAccountInfo(id: String): AccountInfo? {
        try {
            template.queryForRowSet("SELECT * FROM users WHERE userId = ?", id).run {
                first()
                return AccountInfo(
                        getString("userId") ?: "",
                        getString("password") ?: "",
                        getString("authKey") ?: "",
                        getInt("group"),
                        getString("topUserId") ?: "",
                        getString("permissions") ?: "",
                        getDate("createDate") ?: Date(0),
                        getDate("updateDate") ?: Date(0),
                        getDate("deleteDate") ?: Date(0)
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}