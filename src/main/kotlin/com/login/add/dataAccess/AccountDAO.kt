package com.login.add.dataAccess

import com.login.add.value.Account
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class AccountDAO {

    @Autowired
    private lateinit var template: JdbcTemplate

    fun IsValidAccount(id: String, pw: String): Boolean? {
        var encryptedPasswords = pw
        try {
            template.queryForRowSet("SELECT userId FROM users WHERE userId = ? and passwrd = ?", id, encryptedPasswords).run {
                return first()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun getAccountInfo(id: String): Account? {
        try {
            template.queryForRowSet("SELECT userId, topUserId FROM users WHERE userId = ?", id).run {
                first()
                return Account(
                        getString("userId") ?: "",
                        getString("topUserId") ?: ""
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}