package com.login.add.controller

import com.login.add.service.AuthService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import javax.servlet.http.HttpSession

@Controller
@RequestMapping("/login")
class LoginController {

    @Autowired
    private lateinit var authService: AuthService

    @GetMapping
    fun form(): String {
        return "login"
    }

    @PostMapping
    @ResponseBody
    fun login(@RequestParam data: Map<String, String>, session: HttpSession): Map<String, Any?> {
//        return try {
//            var id = data["id"] ?: ""
//            var pw = data["pw"] ?: ""
//
//            var authInfo = authService.authenticate(id, pw)

//            return "redirect:/"
//        } catch (e: Exception) {
//            e.printStackTrace()
//        }
//        return "login/loginForm"

        return try {
            var id = data["id"] ?: ""
            var pw = data["pw"] ?: ""
            println(id)
            println(pw)

            var authInfo = authService.authenticate(id, pw)
            session.setAttribute("authInfo", authInfo)

            mapOf("resultCode" to 0, "user" to id)
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }
}