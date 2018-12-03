package com.login.add.dataAccess

import com.login.add.persistence.queryForJSONObject
import com.login.add.value.Condition
import com.login.add.value.Order
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.Timestamp

@Repository
class StatusDAO {

    @Autowired
    private lateinit var template: JdbcTemplate

    fun getDistributor(userId: String): List<String>? {
        try {
            val returnVal = mutableListOf<String>()
            val sql = "SELECT name FROM (SELECT Id FROM users WHERE `group` = 6) as a LEFT OUTER JOIN (SELECT Id, name FROM userInfos) as b ON a.id = b.id"
            val rs = template.queryForRowSet(sql)

            while (rs.next()) {
                returnVal.add(rs.getString("name") ?: "")
            }
            return returnVal
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun getBranchName(distributorName: String): List<String>? {
        try {
            val returnVal = mutableListOf<String>()
            val sql = "SELECT name FROM (SELECT Id FROM users WHERE `group` = 5 and topUserId in (SELECT userId FROM " +
                        "(SELECT id FROM userInfos WHERE name = '$distributorName') as a LEFT OUTER JOIN users as f ON a.id = f.id )) as c " +
                        "LEFT OUTER JOIN userInfos as d ON c.id = d.id"
            val rs = template.queryForRowSet(sql)

            while (rs.next()) {
                returnVal.add(rs.getString("name") ?: "")
            }
            return returnVal
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun searchOrders(condition: Condition): Map<String, Any>? {
        try {
            val returnValue = mutableMapOf<String, Any>()
            var orders = mutableListOf<Order>()
            var counts = Array(10) { 0 }

            var isValidPayment = false
            var isValidService = false

            var paymentSql = "and paymentType in ("
            for(i in 0 until condition.payment_type.size) {
                isValidPayment = isValidPayment || condition.payment_type[i]
                if(condition.payment_type[i]) paymentSql += "${i+1}, "
            }
            if(paymentSql !== "") paymentSql = paymentSql.substringBeforeLast(", ") + ")"

            var serviceSql = "and isShared in ("
            for(i in 0 until condition.service_type.size) {
                isValidService = isValidService || condition.service_type[i]
                if(condition.service_type[i]) serviceSql += "'${i == 1}', "
            }
            if(serviceSql !== "") serviceSql = serviceSql.substringBeforeLast(", ") + ")"

            if(isValidPayment && isValidService) {
                var sql = "SELECT * FROM orders WHERE createDate > ? and createDate < ? and delayTime < ? "  +
                            "$paymentSql $serviceSql and branchId in (SELECT id FROM userInfos WHERE name = ?)"
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
                        condition.branch
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

    fun searchOrders(data: JSONObject): JSONObject? {
        return template.queryForJSONObject("CALL 프로시저명(?)", data.toString())
    }
}