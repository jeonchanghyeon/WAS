package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.RiderService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/riders")
class RiderController {
    @Autowired
    private lateinit var riderService: RiderService

    @GetMapping
    fun searchRiders(@RequestParam(value = "branch-id") branchId: Long,
                     @RequestParam data: MutableMap<String, Any>): Any {
        /* rider-name, rider-status-id, page-index
        * rider-status-id -> 출근만: 1, 퇴근만: 2, 출근,퇴근(x): -1, 출근,퇴근(o): 0 or null
        * */
        return try {
            val value = riderService.searchList(branchId, data)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    /* result -> [{id1, name1}, {id2, name2}, ....{id11, name11}]*/
    @GetMapping(value = ["list"])
    fun getRiderList(@RequestParam id: Long): Any {
        return try {
            riderService.getRiders(id)!!
        } catch (e: Exception) {
            mapOf("resultCode" to 777)
        }
    }


    /*
        return ->
            {"resultCode":, "description":,
             "rider": {
                        "id", "name", "tel", "allocateCount", "pickupCount",
                        "orders": {
                                    "id", "orderStatusId",
                                    "startingLatitude", "startingLongitude",
                                    "destinationLatitude", "destinationLongitude",
                                    "shopName", "addressDetail"
                                  }
                       }
            }
     */
    @GetMapping(value = ["{rider-id}"])
    fun getRiderInfo(@PathVariable(value = "rider-id") id: Long,
                     @RequestParam(value = "start-date", required = false) startDate: String?,
                     @RequestParam(value = "end-date", required = false) endDate: String?): Any {
        return try {
            val authInfo = getAuthInfo()!!
            riderService.getInfoInControl(authInfo.authKey, id, startDate, endDate)!!
        } catch (e: Exception) {
            mapOf("resultCode" to 777)
        }
    }
}