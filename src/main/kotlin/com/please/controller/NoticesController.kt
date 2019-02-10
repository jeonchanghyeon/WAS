package com.please.controller

import com.please.exception.GroupNotFoundException
import com.please.persistence.getAuthInfo
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/notices")
class NoticesController {
    @GetMapping
    fun showNotices(model: Model): String {
        val authInfo = getAuthInfo()
        model.addAttribute("id", authInfo.id)

        return when (authInfo.group) {
            7 -> {
                "notices/notice_list_head"
            }
            6 -> {
                "notices/notice_list_distrib"
            }
            5 -> {
                "notices/notice_list_branch"
            }
            3 -> {
                "notices/notice_list_shop"
            }
            2 -> {
                "notices/notice_list_rider"
            }
            else -> {
                throw GroupNotFoundException("Notice page load failed. (group = ${authInfo.group})")
            }
        }
    }
}