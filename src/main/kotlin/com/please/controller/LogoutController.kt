package com.please.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import javax.servlet.http.HttpSession

@Controller
class LogoutController {
    @RequestMapping("/logout")
    fun logout(session: HttpSession) : String{
        session.invalidate()
        return "redirect:/status"
    }
}