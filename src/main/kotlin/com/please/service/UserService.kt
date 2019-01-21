package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.UserDAO
import com.please.value.UserInfo
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class UserService {
    @Autowired
    private lateinit var userDAO: UserDAO

    fun getUserInfo(authKey: String, id: Long): JSONObject? {
        return userDAO.getInfo(authKey, id)
    }

    fun setUserInfo(authKey: String, userInfo: UserInfo): JSONObject? {
        return userDAO.setInfo(authKey, ObjectMapper().writeValueAsString(userInfo).toString())
    }
}