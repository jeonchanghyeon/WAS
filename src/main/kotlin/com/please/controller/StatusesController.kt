package com.please.controller

import com.please.exception.GroupNotFoundException
import com.please.persistence.getAuthInfo
import com.please.value.AuthInfo
import org.apache.commons.logging.LogFactory
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping(value = ["/", "/statuses"])
class StatusesController {
    @GetMapping
    fun status(model: Model): String {
        val authInfo = getAuthInfo()
        model.addAttribute("id", authInfo.id)
        model.addAttribute("group", authInfo.group)

        return when (authInfo.group) {
            7 -> {
                "statuses/status_head"
            }
            6 -> {
                "statuses/status_distrib"
            }
            5 -> {
                "statuses/status_branch"
            }
            3 -> {
                "statuses/status_shop"
            }
            2 -> {
                "statuses/status_rider"
            }
            else -> {
                throw GroupNotFoundException("Statuses page load failed. (group = ${authInfo.group})")
            }
        }
    }
}
