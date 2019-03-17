package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.UserDAO
import com.please.exception.AccountNotFoundException
import com.please.value.UserInfo
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class UserService {
    @Autowired
    private lateinit var userDAO: UserDAO

    fun getUserInfo(authKey: String, id: Long): String {
        return userDAO.getInfo(authKey, id)
    }

    fun setUserInfo(authKey: String, userInfo: UserInfo): String {
        return userDAO.setInfo(authKey, ObjectMapper().writeValueAsString(userInfo).toString())
    }

    @Throws(AccountNotFoundException::class)
    fun getUserAccount(authKey: String, id: Long): String {
        val userAccount = JSONObject(userDAO.getAccount(authKey, id))
        userAccount["account"] as? String
                ?: throw AccountNotFoundException("Account info load failed. (user = ${userAccount["userName"]})")

        return userAccount.toString()
    }

    fun getTransactionInformation(authKey: String, id: Long): String {
        val jsonInfo = JSONObject()
        jsonInfo.put("id", id)

        return userDAO.getTransactionInformation(authKey, jsonInfo.toString())
    }

    fun checkDepositPassword(authKey: String, id: Long, password: String): Boolean {
        val user = JSONObject(getUserInfo(authKey, id))
        val userAdditional = (user["user"] as JSONObject)["additional"] as JSONObject

        return if (userAdditional.has("pointPassword")) {
            val pointPassword = userAdditional["pointPassword"] as String
            (pointPassword === password)
        } else {
            true
        }
    }
}