package com.login.add.dataAccess

import com.login.add.persistence.queryForJSONObject
import com.login.add.value.AuthInfo
import com.login.add.value.Condition
import com.login.add.value.Order
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

    fun getDistributor(authInfo: AuthInfo): MutableList<Map<String, Any?>>? {
        val id = template.queryForObject("SELECT getUId('${authInfo.id}')", Int::class.java)
        val userInfoResult: JSONObject? = template.queryForJSONObject("CALL getUser(?, ?)", authInfo.authKey, id)
        val returnVal = mutableListOf<Map<String, Any?>>()
        val userInfo = userInfoResult?.get("user") as JSONObject

        try {
            when (userInfo.get("group") as Int) {
                7 -> {
                    val sql = "SELECT users.id, name FROM users INNER JOIN userInfos ON users.id = userInfos.id WHERE `group` = 6 and topUserId = '${authInfo.id}'"
                    val rs = template.queryForRowSet(sql)
                    while (rs.next()) {
                        val resId = rs.getInt("id")
                        val resName = rs.getString("name")
                        returnVal.add(mapOf("id" to resId, "name" to resName.toString()))
                    }
                }
                6 -> {
                    val sql = "SELECT getUserNameById($id)"
                    val resName = template.queryForObject(sql, String::class.java)
                    returnVal.add(mapOf("id" to id, "name" to resName))
                }
                5 -> {
                    val sql = "SELECT id FROM users WHERE `group` = 6 and userId = getTopUserIdById($id)"
                    val resId = template.queryForObject(sql, Int::class.java)
                    val resName = template.queryForObject("SELECT getUserNameById($resId)", String::class.java)
                    returnVal.add(mapOf("id" to resId, "name" to resName))
                }
                else -> {
                    val branchId = template.queryForObject("SELECT getBranchUIdByUserId('${authInfo.id}')", Int::class.java)
                    if (branchId != null) {
                        val resId = template.queryForObject("SELECT getTopUserIdById($branchId)", String::class.java)
                        val resName = template.queryForObject("SELECT getUserNameById($resId)", String::class.java)
                        returnVal.add(mapOf("id" to resId, "name" to resName))
                    } else {
                        val sql = "SELECT users.id, name FROM users INNER JOIN userInfos ON users.id = userInfos.id WHERE `group` = 6 and topUserId = '${authInfo.id}'"
                        val rs = template.queryForRowSet(sql)
                        while (rs.next()) {
                            val resId = rs.getInt("id")
                            val resName = rs.getString("name")
                            returnVal.add(mapOf("id" to resId, "name" to resName))
                        }
                    }
                }
            }
            return returnVal
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun getBranchs(authInfo: AuthInfo, distributorId: Int): MutableList<Map<String, Any?>>? {
        val id = template.queryForObject("SELECT getUId('${authInfo.id}')", Int::class.java)
        val userInfoResult: JSONObject? = template.queryForJSONObject("CALL getUser(?, ?)", authInfo.authKey, id)
        val userInfo = userInfoResult?.get("user") as JSONObject
        val returnVal = mutableListOf<Map<String, Any?>>()

        try {
            when (userInfo.get("group") as Int) {
                in 6..7 -> {
                    val sql = "SELECT users.id, name FROM users INNER JOIN userInfos ON users.id = userInfos.id WHERE `group` = 5 and topUserId = getUserIdById($distributorId)"
                    val rs = template.queryForRowSet(sql)
                    while (rs.next()) {
                        val resId = rs.getInt("id")
                        val resName = rs.getString("name")
                        returnVal.add(mapOf("id" to resId, "name" to resName))
                    }
                }
                5 -> {
                    val resName = template.queryForObject("SELECT getUserNameById($id)", String::class.java)
                    returnVal.add(mapOf("id" to id, "name" to resName))
                }
                else -> {
                    val branchId = template.queryForObject("SELECT getBranchUIdByUserId($id)", Int::class.java)
                    if (branchId != null) {
                        val resName = template.queryForObject("SELECT getUserNameById($branchId)", String::class.java)
                        returnVal.add(mapOf("id" to branchId, "name" to resName))
                    }
                }
            }
            return returnVal
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun searchOrders(authInfo: AuthInfo, condition: Condition): Map<String, Any>? {
        try {
            val returnValue = mutableMapOf<String, Any>()
            var orders = mutableListOf<Order>()
            var counts = Array(10) { 0 }

            var isValidPayment = false
            var isValidService = false

            var paymentSql = "and paymentType in ("
            for (i in 0 until condition.payment_type.size) {
                isValidPayment = isValidPayment || condition.payment_type[i]
                if (condition.payment_type[i]) paymentSql += "${i + 1}, "
            }
            if (paymentSql !== "") paymentSql = paymentSql.substringBeforeLast(", ") + ")"

            var serviceSql = "and isShared in ("
            for (i in 0 until condition.service_type.size) {
                isValidService = isValidService || condition.service_type[i]
                if (condition.service_type[i]) serviceSql += "'${i == 1}', "
            }
            if (serviceSql !== "") serviceSql = serviceSql.substringBeforeLast(", ") + ")"

            if (isValidPayment && isValidService) {
                var sql = "SELECT * FROM orders WHERE createDate > ? and createDate < ? and delayTime < ? " +
                        "$paymentSql $serviceSql and branchId = ?"
                sql = "SELECT * FROM ($sql) as t1 LEFT OUTER JOIN (SELECT id as id2, name as shopName FROM userInfos) as t2 ON shopId = id2"
                sql = "SELECT * FROM ($sql) as t3 LEFT OUTER JOIN (SELECT id as id3, name as riderName FROM userInfos) as t4 ON riderId = id3"
                sql = "SELECT * FROM ($sql) as t5 LEFT OUTER JOIN (SELECT id as id4, label as paymentLabel FROM paymentTypes) as t6 ON paymentType = id4"
                sql = "SELECT id, shopName, createDate, shopName, orderStatusLabel, allocateDate, pickupDate, completeDate, cancelDate, " +
                        "deliveryCost, additionalCost, riderName, paymentLabel, memo, isShared, orderStatusId " +
                        "FROM ($sql) as t7 LEFT OUTER JOIN (SELECT id as id5, label as orderStatusLabel FROM orderStatuses) as t8 ON orderStatusId = id5"

                val rs = template.queryForRowSet(sql,
                        condition.start_date,
                        condition.end_date,
                        condition.delay_time,
                        condition.branchId
                )

                while (rs.next()) {
                    val order = Order(
                            rs.getInt("id"),
                            rs.getString("shopName") ?: "",
                            rs.getString("orderStatusLabel") ?: "",
                            rs.getString("orderStatusId"),
                            rs.getString("isShared") ?: "false",
                            rs.getTimestamp("createDate") ?: Timestamp(0),
                            rs.getTimestamp("allocateDate") ?: Timestamp(0),
                            rs.getTimestamp("pickupDate") ?: Timestamp(0),
                            rs.getTimestamp("completeDate") ?: Timestamp(0),
                            rs.getTimestamp("cancelDate") ?: Timestamp(0),
                            rs.getInt("deliveryCost"),
                            rs.getString("additionalCost"),
                            rs.getString("riderName") ?: "",
                            rs.getString("paymentLabel") ?: "",
                            rs.getString("memo") ?: ""
                    )
                    orders.add(order)
                    if (order.shared.equals("true")) counts[9]++
                    else counts[Integer.parseInt(order.statusId) - 1]++
                }
            }
            returnValue["orders"] = orders
            returnValue["counts"] = counts

            return returnValue
        } catch (e: Exception) {
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