package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.UserService
import com.please.value.UserInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

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

    @RequestMapping(value = ["{id}"], method = [RequestMethod.POST])
    fun updateUserInfo(@PathVariable(value = "id") id: Long,
                       @RequestBody userInfo: UserInfo): Any {
        return try {
            val authInfo = getAuthInfo()!!
            userInfo.id = id
            val value = userService.setUserInfo(authInfo.authKey, userInfo)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}