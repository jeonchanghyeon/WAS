package com.login.add.service

import com.login.add.dataAccess.AccountDAO
import com.login.add.value.Account
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class AccountService {

    @Autowired
    private lateinit var accountDAO: AccountDAO

    fun getAccountInfo(id: String): Account? {
        return accountDAO.getAccountInfo(id)
    }

    fun IsValidAccount(id: String, pw: String): Boolean? {
        return accountDAO.IsValidAccount(id, pw)
    }
}

