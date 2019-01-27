package com.please.controller

import com.please.persistence.getAuthInfo
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/controls")
class ControlsController {

    @GetMapping
    fun showShopsControl(model: Model): String {
        val authInfo = getAuthInfo()!!

        model.addAttribute("id", authInfo.id)

        when (authInfo.group) {
            7 -> {
                return "controls/control_head"
            }
            6 -> {
                return "controls/control_distrib"
            }
            in 4..5 -> {
                return "controls/control_branch"
            }
            3 -> {
                return "controls/control_shop"
            }
        }
        return "login"
    }
}

