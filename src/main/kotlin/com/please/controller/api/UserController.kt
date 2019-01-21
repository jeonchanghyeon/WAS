package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
class UserController {
    @Autowired
    private lateinit var userService: UserService

    /* return -> {	"resultCode", "description",
                    "user": {
                                "id", "userId", "group", "topUserId", "permissions", "createDate", "updateDate", "name",
                                "tel", "email", "address", "roadAddress", "addressDetail", "latitude", "longitude",
                                "additional": {
                                                "distance", "isUseDong", "distanceFactor"
                                               }
                            }
                  }
    */
    @GetMapping(value = ["{id}"])
    fun showUserInfo(@PathVariable(value = "id") id: Long): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = userService.getUserInfo(authInfo.authKey, id)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}