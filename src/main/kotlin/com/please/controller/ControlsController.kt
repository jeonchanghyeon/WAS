package com.please.controller

import com.please.persistence.getAuthInfo
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/controls")
class ControlsController {

    @GetMapping(value = ["shop"])
    fun showShopsControl(): String {
        val authInfo = getAuthInfo()!!
        when (authInfo.group) {
            7 -> {
                return "controls/shop_control_head"
            }
            6 -> {
                return "controls/shop_control_distrib"
            }
            in 4..5 -> {
                return "controls/shop_control_branch"
            }
            3 -> {
                return "controls/shop_control_shop"
            }
            2 -> {
                return "controls/shop_control_rider"
            }
        }
        return "login"
    }

    @GetMapping(value = ["rider"])
    fun showRidersControl(): String {
        val authInfo = getAuthInfo()!!
        when (authInfo.group) {
            7 -> {
                return "controls/rider_control_head"
            }
            6 -> {
                return "controls/rider_control_distrib"
            }
            in 4..5 -> {
                return "controls/rider_control_branch"
            }
            3 -> {
                return "controls/rider_control_shop"
            }
            2 -> {
                return "controls/rider_control_rider"
            }
        }
        return "login"
    }
}