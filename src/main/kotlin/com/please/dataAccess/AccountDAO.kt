package com.please.dataAccess

import com.please.value.AccountInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.Timestamp

@Repository
class AccountDAO {

    @Autowired
    @Qualifier("jdbcMain")
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
                        getTimestamp("createDate") ?: Timestamp(0),
                        getTimestamp("updateDate") ?: Timestamp(0),
                        getTimestamp("deleteDate") ?: Timestamp(0)
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}