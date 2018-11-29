package com.login.add.service

import com.login.add.dataAccess.AccountDAO
import com.login.add.value.AuthInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.crypto.bcrypt.BCrypt
import org.springframework.stereotype.Service

@Service
class AuthService {

    @Autowired
    private lateinit var accountDAO: AccountDAO

    fun authenticate(id: String, pw: String): AuthInfo? {
        try {
            var accountInfo = accountDAO.getAccountInfo(id)

            if (accountInfo == null) {
                // 없는 id인 경우
            }

            if (!BCrypt.checkpw(pw, accountInfo?.hashedPassword)) {
                // id와 pw 와 맞지 않을 경우
            }

            return AuthInfo(accountInfo?.userId ?: "", accountInfo?.group ?: -1)
        } catch (e: Exception) {
            e.printStackTrace()
        }

        return null
    }
}