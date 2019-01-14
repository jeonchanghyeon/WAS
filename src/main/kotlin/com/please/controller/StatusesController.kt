package com.please.controller

import com.please.persistence.getAuthInfo
import com.please.service.PointService
import com.please.service.SearchBranchListService
import com.please.service.SearchDistributorListService
import com.please.service.StatusService
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/statuses")
class StatusesController {
    @Autowired
    private lateinit var statusService: StatusService
    @Autowired
    private lateinit var pointService: PointService
    @Autowired
    private lateinit var searchBranchListService: SearchBranchListService
    @Autowired
    private lateinit var searchDistributorListService: SearchDistributorListService

    @GetMapping
    fun status(model: Model): String {
        val authInfo = getAuthInfo()!!

        var branchs = mutableListOf<Map<String, Any?>>()
        var branchSettings = JSONObject()

        var point = pointService.getPoint(authInfo.authKey)
        var distributors = searchDistributorListService.getDistributors(authInfo) ?: mutableListOf()
        if (distributors.size == 1) {
            branchs = searchBranchListService.getBranchs(authInfo, distributors[0]["id"] as Long) ?: mutableListOf()
            if (branchs.size != 1) branchs.add(0, mapOf("id" to -1, "name" to "--"))
        } else {
            distributors.add(0, mapOf("id" to -1, "name" to "--"))
            branchs.add(0, mapOf("id" to -1, "name" to "--"))
        }

        model.addAttribute("point", point)
        model.addAttribute("distributors", distributors)
        model.addAttribute("branchs", branchs)
        model.addAttribute("branchSettings", branchSettings)

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