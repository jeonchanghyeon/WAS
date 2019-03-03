package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.AddressService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/address")
class AddressController {
    @Autowired
    private lateinit var addressService: AddressService

    @GetMapping
    fun searchAddress(@RequestParam data: MutableMap<String, Any>): Any {
        return addressService.searchAddress(data)
    }

    /*  result ->
        {   "resultCode", "description",
            "enableDong": { "id", "districtCode", "siDo", "siGunGu",
                            "eubMyeonDong", "latitude", "longitude"
                           }
        }
     */
    @GetMapping(value = ["enable-dong"])
    fun getEnableArea(@RequestParam(value = "id") id: Long,
                      @RequestParam(value = "consonant") consonant: Int,
                      @RequestParam(value = "pageIndex", required = false) pageIndex: Int?): Any {
        /*  id -> 상점 아이디
            consonant -> 0:전체, 1:ㄱ, 2:ㄴ ...... 14:ㅎ
        */
        val authInfo = getAuthInfo()
        return addressService.getEnableArea(authInfo.authKey, id, consonant, pageIndex)
    }
}