package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.BranchService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import javax.servlet.http.HttpServletRequest

@RestController
@RequestMapping("/api/branches")
class BranchController {
    @Autowired
    private lateinit var branchService: BranchService

    @GetMapping
    fun getBranchList(@RequestParam(value = "id") id: Long): MutableList<Map<String, Any?>>? {
        val authInfo = getAuthInfo()!!

        val branches = branchService.getBranches(authInfo, id) ?: mutableListOf()
        if (branches.size != 1) {
            branches.add(0, mapOf("id" to -1, "name" to "--"))
        }
        return branches
    }

    @GetMapping(value = ["{branch-id}/settings"])
    fun getBranchSettings(request: HttpServletRequest, @PathVariable(value = "branch-id") id: String): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = branchService.getBranchSettings(authInfo.authKey, id)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777)
        }
    }

    @PostMapping(value = ["{branch-id}/settings"])
    fun setBranchSettings(@RequestBody data: MutableMap<String, Any?>, @PathVariable(value = "branch-id") id: String): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = branchService.setBranchSettings(authInfo.authKey, data, id)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777)
        }
    }
}