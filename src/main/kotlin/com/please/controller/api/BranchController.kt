package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.BranchService
import com.please.value.BranchSettings
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
        val authInfo = getAuthInfo()
        return branchService.searchList(authInfo.authKey, branchName, metro, pageIndex)
    }

    @GetMapping(value = ["list"])
    fun getBranchList(@RequestParam id: Long,
                      @RequestParam(required = false) name: String?): Any {
        return branchService.getBranches(id, name)
    }

    @GetMapping(value = ["{branch-id}/settings"])
    fun getBranchSettings(@PathVariable(value = "branch-id") id: Long): Any {
        val authInfo = getAuthInfo()
        return branchService.getBranchSettings(authInfo.authKey, id)
    }

    @PostMapping(value = ["{branch-id}/settings"])
    fun setBranchSettings(@RequestBody branchSettings: BranchSettings, @PathVariable(value = "branch-id") id: Long): Any {
        val authInfo = getAuthInfo()
        branchSettings.id = id
        return branchService.setBranchSettings(authInfo.authKey, branchSettings)
    }

    /*{
        "resultCode": "description",
        "branchStatus":{
            "id", "name":, "latitude", "longitude",
            "riderTotal", "riderWorkOn", "riderWorkOff",
            "acceptCount", "allocateCount", "pickupCount", "completeCount", "orderTotalCount"
        }
      }*/
    @GetMapping(value = ["{branch-id}/status"])
    fun getBranchStatus(@PathVariable(value = "branch-id") id: Long): Any {
        val authInfo = getAuthInfo()
        return branchService.getStatus(authInfo.authKey, id)
    }
}