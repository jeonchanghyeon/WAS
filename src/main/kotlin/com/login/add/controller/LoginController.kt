package com.login.add.controller

import com.login.add.service.AuthService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
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
    fun login(@RequestParam data: Map<String, String>, session: HttpSession): String {
        return try {
            var id = data["id"] ?: ""
            var pw = data["pw"] ?: ""
            println(id)
            println(pw)

            var authInfo = authService.authenticate(id, pw)
            session.setAttribute("authInfo", authInfo)

            "redirect:/status"
        } catch (e: Exception) {
            e.printStackTrace()
            "login"
        }
    }
}