package com.please.controller

import com.please.persistence.getAuthInfo
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping(value = ["/", "/statuses"])
class StatusesController {
    @GetMapping
    fun status(model: Model): String {
        val authInfo = getAuthInfo()!!

        model.addAttribute("id", authInfo.id)

        when (authInfo.group) {
            7 -> {
                return "statuses/status_head"
            }
            6 -> {
                return "statuses/status_distrib"
            }
            5 -> {
                return "statuses/status_branch"
            }
            3 -> {
                return "statuses/status_shop"
            }
            2 -> {
                return "statuses/status_rider"
            }
        }
        return "login"
    }
}