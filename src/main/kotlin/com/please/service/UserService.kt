package com.please.service

import com.please.dataAccess.UserDAO
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
}