package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.ShopService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/shops")
class ShopController {
    @Autowired
    private lateinit var shopService: ShopService

    @GetMapping
    fun searchShops(@RequestParam(value = "branch-id") branchId: Long,
                    @RequestParam data: MutableMap<String, Any>): Any {
        /* shop-name, page-index */
        return try {
            val value = shopService.searchList(branchId, data)
            println(value)
            value!!.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
        }
    }

    @GetMapping
    fun getShopList(@RequestParam id: Long,
                    @RequestParam group: Int): MutableList<Map<String, Any?>>? {
        val shops = shopService.getShops(id, group) ?: mutableListOf()
        if (shops.size != 1) {
            shops.add(0, mapOf("id" to -1, "name" to "--"))
        }
        return shops
    }
}