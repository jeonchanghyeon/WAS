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

    @GetMapping(value = ["list"])
    fun getBranchList(@RequestParam(required = false) id: Long?,
                      @RequestParam(required = false) group: Int?): MutableList<Map<String, Any?>>? {
        val branches: MutableList<Map<String, Any?>>?

        if(id == null || group == null) {
            val authInfo = getAuthInfo()!!
            branches = branchService.getBranches(authInfo.id, authInfo.group) ?: mutableListOf()
        } else {
            branches = branchService.getBranches(id, group) ?: mutableListOf()
        }

        if (branches.size != 1) {
            branches.add(0, mapOf("id" to -1, "name" to "--"))
        }
        return branches
    }

    @GetMapping(value = ["{branch-id}/settings"])
    fun getBranchSettings(@PathVariable(value = "branch-id") id: String): Any {
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