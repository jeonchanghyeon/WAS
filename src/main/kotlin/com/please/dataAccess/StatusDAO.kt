package com.please.dataAccess

import com.please.persistence.queryForJSONObject
import com.please.value.AuthInfo
import com.please.value.Condition
import com.please.value.Order
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.Timestamp

@Repository
class StatusDAO {

    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    //총판 이름과 id를 쿼리
    fun getDistributor(authInfo: AuthInfo): MutableList<Map<String, Any?>>? {
        var returnVal: MutableList<Map<String, Any?>>? = null

        try {
            val sql = "SELECT users.id, name FROM users INNER JOIN userInfos ON users.id = userInfos.id WHERE `group` = 6"
            returnVal = mutableListOf(template.queryForMap(sql))
            println(returnVal.toString())
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return returnVal
    }

    //지사 id와 이름 목록 쿼리
    fun getBranchs(authInfo: AuthInfo, distributorId: Long): MutableList<Map<String, Any?>>? {
        var returnVal: MutableList<Map<String, Any?>>? = null

        try {
            when (authInfo.group) {
                in 6..7 -> {
                    val sql = "SELECT users.id, name FROM users INNER JOIN userInfos ON users.id = userInfos.id WHERE `group` = 5 and topUserId = getUserIdById($distributorId)"
                    returnVal = template.queryForList(sql)
                }
                in 1..5 -> {
                    val sql = "SELECT getBranchUIdByUserId('${authInfo.id}') as id, getUserNameById(getBranchUIdByUserId('${authInfo.id}')) as name"
                    returnVal = mutableListOf(template.queryForMap(sql))
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return returnVal
    }

    //검색 조건에 맞는 주문 목록 쿼리
    fun searchOrders(authInfo: AuthInfo, conditionJSONObject: JSONObject): JSONObject? {
//        try {
//            val returnValue = mutableMapOf<String, Any>()
//            var orders = mutableListOf<Order>()
//            var counts = Array(10) { 0 }
//
//            var isValidPayment = false
//            var isValidService = false
//
//            var paymentSql = "and paymentType in ("
//            for (i in 0 until condition.payment_type.size) {
//                isValidPayment = isValidPayment || condition.payment_type[i]
//                if (condition.payment_type[i]) paymentSql += "${i + 1}, "
//            }
//            if (paymentSql !== "") paymentSql = paymentSql.substringBeforeLast(", ") + ")"
//
//            var serviceSql = "and isShared in ("
//            for (i in 0 until condition.service_type.size) {
//                isValidService = isValidService || condition.service_type[i]
//                if (condition.service_type[i]) serviceSql += "'${i == 1}', "
//            }
//            if (serviceSql !== "") serviceSql = serviceSql.substringBeforeLast(", ") + ")"
//
//            var searchSql = ""
//            if(condition.word != "") {
//                when (condition.search_type) {
//                    "id" -> {
//                        searchSql =" and id='${condition.word}' "
//                    }
//                    "shopName" -> {
//                        searchSql =" and shopName='${condition.word}' "
//                    }
//                    "riderName" -> {
//                        searchSql =" and riderName='${condition.word}' "
//                    }
//                }
//            }
//            if (isValidPayment && isValidService) {
//                var sql = "SELECT *, getUserNameById(shopId) as shopName, getUserNameById(riderId) as riderName, getAdditionalCost(`additionalCost`) as calAdditionalCost " +
//                        "FROM orders WHERE createDate > ? and createDate < ? $paymentSql $serviceSql and branchId = ? $searchSql"
//                sql = "SELECT * from ($sql) as t1 LEFT OUTER JOIN (SELECT id as paymentId, label as paymentLabel FROM paymentTypes) as t2 ON t1.paymentType = t2.paymentId"
//                sql = "SELECT * from ($sql) as t1 LEFT OUTER JOIN (SELECT id as orderId, label as orderStatusLabel FROM orderStatuses) as t2 ON t1.orderStatusId = t2.orderId"
//
//                val rs = template.queryForRowSet(sql,
//                        condition.start_date,
//                        condition.end_date,
//                        condition.branchId
//                )
//
//                while (rs.next()) {
//                    val order = Order(
//                            rs.getInt("id"),
//                            rs.getString("shopName") ?: "",
//                            rs.getString("orderStatusLabel") ?: "",
//                            rs.getString("orderStatusId"),
//                            rs.getString("isShared") ?: "false",
//                            rs.getTimestamp("createDate") ?: Timestamp(0),
//                            rs.getTimestamp("allocateDate") ?: Timestamp(0),
//                            rs.getTimestamp("pickupDate") ?: Timestamp(0),
//                            rs.getTimestamp("completeDate") ?: Timestamp(0),
//                            rs.getTimestamp("cancelDate") ?: Timestamp(0),
//                            rs.getInt("deliveryCost"),
//                            rs.getInt("calAdditionalCost"),
//                            rs.getString("riderName") ?: "",
//                            rs.getString("paymentLabel") ?: "",
//                            rs.getString("memo") ?: ""
//                    )
//                    orders.add(order)
//                    if (order.shared == "true") counts[9]++
//                    else counts[Integer.parseInt(order.statusId) - 1]++
//                }
//            }
//            returnValue["orders"] = orders
//            returnValue["counts"] = counts
//
//            return returnValue
//        } catch (e: Exception) {
//            e.printStackTrace()
//        }

        println(conditionJSONObject.toString())
        try {
            return template.queryForJSONObject("CALL getSearchedOrders(?, ?)", authInfo.authKey, conditionJSONObject.toString())
        } catch(e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun getBranchSettings(authKey: String, branchId: String): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getBranchSettings(?, ?)", authKey, branchId)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun setBranchSettings(branchId: String, jsonData: String): JSONObject? {
        try {
            return template.queryForJSONObject("CALL setBranchSettings(?, ?)", branchId, jsonData)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}