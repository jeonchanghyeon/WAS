package com.please.controller.api

import com.please.service.ShopService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/shops")
class ShopController {
    @Autowired
    private lateinit var shopService: ShopService

    /* result -> {resultCode: 0, shops: {id1, name1}, {id2, name2}, ....{id11, name11}]*/
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

    /* result -> [{id1, name1}, {id2, name2}, ....{id11, name11}]*/
    @GetMapping(value = ["list"])
    fun getShopList(@RequestParam id: Long): Any {
        return try {
            shopService.getShops(id)!!
        } catch (e: Exception) {
            mapOf("resultCode" to 777)
        }
    }
}