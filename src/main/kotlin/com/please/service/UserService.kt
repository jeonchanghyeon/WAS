package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.PointDAO
import com.please.dataAccess.UserDAO
import com.please.exception.AccountNotFoundException
import com.please.value.UserInfo
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService {
    @Autowired
    private lateinit var userDAO: UserDAO
    @Autowired
    private lateinit var pointService: PointService

    fun getUserInfo(authKey: String, id: Long): String {
        return userDAO.getInfo(authKey, id)
    }

    fun setUserInfo(authKey: String, userInfo: UserInfo): String {
        return userDAO.setInfo(authKey, ObjectMapper().writeValueAsString(userInfo).toString())
    }

    @Throws(AccountNotFoundException::class)
    fun getUserAccount(authKey: String, id: Long): String {
        val userAccount = JSONObject(userDAO.getAccount(authKey, id))
        userAccount["account"] as? String ?: throw AccountNotFoundException("Account info load failed. (user = ${userAccount["userName"]})")

        return userAccount.toString()
    }

    @Transactional
    @Throws(AccountNotFoundException::class)
    fun getAccountInfo(authKey: String, id: Long): String {
        val userAccount = JSONObject(getUserAccount(authKey, id))
        val pointObj = JSONObject(pointService.getPoint(id))

        userAccount.put("point", (pointObj["point"] as JSONObject)["point"])
        return userAccount.toString()
    }

    fun getTransactionInformation(authKey: String, id: Long):String {
        val jsonInfo = JSONObject()
        jsonInfo.put("id", id)

        return userDAO.getTransactionInformation(authKey, jsonInfo.toString())
    }
}