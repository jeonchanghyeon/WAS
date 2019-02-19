package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.ShopService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

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
        return shopService.searchList(branchId, data)
    }

    /* result -> [{id1, name1}, {id2, name2}, ....{id11, name11}]*/
    @GetMapping(value = ["list"])
    fun getShopList(@RequestParam id: Long): Any {
        return shopService.getShops(id)
    }

    @GetMapping(value = ["{id}/menu-list"])
    fun getMenuList(@PathVariable id: Long): Any {
        val authInfo = getAuthInfo()
        return shopService.getMenu(authInfo.authKey, id)
    }
}