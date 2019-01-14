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
    private lateinit var statusService: StatusService
    @Autowired
    private lateinit var branchService: BranchService

    @GetMapping
    fun getBranchList(@RequestParam(value = "id") id: Long): MutableList<Map<String, Any?>>? {
        val authInfo = getAuthInfo()!!

        val branchs = branchService.getBranchs(authInfo, id) ?: mutableListOf()
        if (branchs.size != 1) {
            branchs.add(0, mapOf("id" to -1, "name" to "--"))
        }
        return branchs
    }

    @GetMapping(value = ["{branch-id}/settings"])
    fun getBranchSettings(request: HttpServletRequest, @PathVariable(value = "branch-id") id: String): Any {
        return try {
            val authInfo = getAuthInfo()!!
            var value = statusService.getBranchSettings(authInfo.authKey, id)
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
            var value = statusService.setBranchSettings(authInfo.authKey, data, id)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777)
        }
    }
}