package com.please.service

import com.please.dataAccess.AccountDAO
import com.please.value.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Service

@Service
class AuthService : UserDetailsService {
    @Autowired
    private lateinit var accountDAO: AccountDAO

    override fun loadUserByUsername(userId: String?): User? {
        return accountDAO.getUser(userId ?: "")
    }
}

