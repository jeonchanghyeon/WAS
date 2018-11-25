package com.login.add.controller

import com.login.add.service.AccountService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam

@Controller
class LoginController {

    @Autowired
    private lateinit var accountService: AccountService

    @RequestMapping(value = ["/login"], method = [RequestMethod.POST])
    fun login(@RequestParam("id") id: String, @RequestParam("pw") pw: String, model: Model): String {
        try {
            var isvValid = accountService.IsValidAccount(id, pw)
            println(isvValid)
            model.addAttribute("logined", "${isvValid.toString()}")
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return "login"
    }

    @RequestMapping(value = ["/home"], method = [RequestMethod.GET])
    fun home(): String {
        return "home"
    }


//    @RequestMapping(value = ["/home/get/{id}"], method = [RequestMethod.GET])
//    @ResponseBody
//    fun getData(@PathVariable id: String): Map<String, Any?> {
////        return mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
//        return try {
//            val value = homeService.getUserInfo(id)
//            mapOf("resultCode" to 0, "user" to value)
//        } catch (e: Exception) {
//            e.printStackTrace()
//            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
//        }
//    }
//
//    @RequestMapping(value = ["/home/add"], method = [RequestMethod.POST])
//    @ResponseBody
//    fun insert(@RequestParam data: MutableMap<String, String>): Map<String, Any?> {
//        return try {
//            homeService.insertUserInfo(data)
//            mapOf("resultCode" to 0)
//        } catch (e: Exception) {
//            e.printStackTrace()
//            mapOf("resultCode" to 777, "description" to "알 수 없는 에러입니다.")
//        }
//    }
//
//    @RequestMapping("/index")
//    fun show(params: MyRequestParams, model: Model): String {
//        model.addAttribute("params", "Hello  ${params.no} - ${params.name}")
//        println(params.no)
//        println(params.name)
//        return "index"
//    }
}

//class MyRequestParams(var no: Int = 0, var name: String = "")
