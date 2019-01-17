package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.BranchService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/branches")
class BranchController {
    @Autowired
    private lateinit var branchService: BranchService

    @GetMapping
    fun searchBranches(@RequestParam(value = "branch-name", required = false) branchName: String?,
                        @RequestParam(value = "metro", required = false) metro: String?,
                        @RequestParam(value = "pageIndex", required = false) pageIndex: Int?): Any {
        return try {
            val authInfo = getAuthInfo()!!
            val value = branchService.searchList(authInfo.authKey, branchName, metro, pageIndex)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @GetMapping(value = ["list"])
    fun getBranchList(@RequestParam id: Long): Any {
        return try {
            branchService.getBranches(id)!!
        } catch (e: Exception) {
            mapOf("resultCode" to 777)
        }
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