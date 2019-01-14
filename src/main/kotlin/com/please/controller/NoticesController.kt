package com.please.controller

import com.please.persistence.getAuthInfo
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import javax.servlet.http.HttpServletRequest

@Controller
@RequestMapping("/notices")
class NoticesController {
    @GetMapping
    fun showList(): String {
        val authInfo = getAuthInfo()!!
        when (authInfo.group) {
            7 -> {
                return "notices/notice_list_head"
            }
            6 -> {
                return "notices/notice_list_distrib"
            }
            in 4..5 -> {
                return "notices/notice_list_branch"
            }
            3 -> {
                return "notices/notice_list_shop"
            }
            2 -> {
                return "notices/notice_list_rider"
            }
        }
        return "login"
    }

    @GetMapping(value = ["detail"])
    fun showDetail(request: HttpServletRequest, model: Model): String {
        val authInfo = getAuthInfo()!!
        when (authInfo.group) {
            7 -> {
                return "notices/notice_detail_head"
            }
            6 -> {
                return "notices/notice_detail_distrib"
            }
            in 4..5 -> {
                return "notices/notice_detail_branch"
            }
            3 -> {
                return "notices/notice_detail_shop"
            }
            2 -> {
                return "notices/notice_detail_rider"
            }
        }
        return "login"
    }

    @GetMapping(value = ["add"])
    fun add(request: HttpServletRequest, model: Model): String {
        val authInfo = getAuthInfo()!!
        when (authInfo.group) {
            7 -> {
                return "notices/notice_add_head"
            }
            6 -> {
                return "notices/notice_add_distrib"
            }
            in 4..5 -> {
                return "notices/notice_add_branch"
            }
            3 -> {
                return "notices/notice_add_shop"
            }
            2 -> {
                return "notices/notice_add_rider"
            }
        }
        return "login"
    }
}