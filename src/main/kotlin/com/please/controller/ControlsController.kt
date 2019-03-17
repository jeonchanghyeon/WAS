package com.please.controller

import com.please.exception.GroupNotFoundException
import com.please.persistence.getAuthInfo
import com.please.value.AuthInfo
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/controls")
class ControlsController {

    @GetMapping
    fun showControl(model: Model): String {
        val authInfo = getAuthInfo()
        model.addAttribute("id", authInfo.id)
        model.addAttribute("group", authInfo.group)

        return when (authInfo.group) {
            7 -> {
                "controls/control_head"
            }
            6 -> {
                "controls/control_distrib"
            }
            5 -> {
                "controls/control_branch"
            }
            3 -> {
                "controls/control_shop"
            }
            else -> {
                throw GroupNotFoundException("Control page load failed. (group = ${authInfo.group})")
            }
        }
    }
}

