package com.login.add.service

import com.login.add.dataAccess.HomeDAO
import com.login.add.value.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class HomeService {

    @Autowired
    private lateinit var homeDAO: HomeDAO

    fun getUserInfo(id: String): User? {
        return homeDAO.getUserInfo(id)
    }

    fun insertUserInfo(data: MutableMap<String, String>): Int? {
        return homeDAO.addUserInfo(data)
    }
}