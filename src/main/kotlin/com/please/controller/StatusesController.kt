package com.please.controller

import com.please.persistence.getAuthInfo
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/statuses")
class StatusesController {
    @GetMapping
    fun status(model: Model): String {
        val authInfo = getAuthInfo()!!

        model.addAttribute("id", authInfo.id)

        when (authInfo.group) {
            7 -> {
                return "statues/status_head"
            }
            6 -> {
                return "statues/status_distrib"
            }
            in 4..5 -> {
                return "statues/status_branch"
            }
            3 -> {
                return "statues/status_shop"
            }
            2 -> {
                return "statues/status_rider"
            }
        }
        return "login"
    }
}