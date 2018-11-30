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
            val rs = template.queryForRowSet("SELECT userId FROM users WHERE `group` = 6")

            while (rs.next()) {
                returnVal.add(rs.getString("userId") ?: "")
            }
            return returnVal
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun getBranchName(distributeNum: String): List<String>? {
        try {
            val returnVal = mutableListOf<String>()
            val rs = template.queryForRowSet("SELECT userId FROM users WHERE `group` = 5 and `topUserId` = $distributeNum")

            while (rs.next()) {
                returnVal.add(rs.getString("userId") ?: "")
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
            val orders = mutableMapOf<String, Order>()
            var counts = Array(9) { 0 }

            var branch = condition.branch
            var sdate = condition.start_data
            var edate = condition.end_date

            val rs = template.queryForRowSet("SELECT * FROM orders WHERE branchId = ? and createDate > ? and createDate < ?", branch, sdate, edate)

            while (rs.next()) {
                var id = rs.getString("id")
                orders[id] = Order(
                        rs.getInt("id"),
                        rs.getString("shopId") ?: "",
                        rs.getString("orderStatusId") ?: "",
                        rs.getTimestamp("createDate") ?: Timestamp(0),
                        rs.getTimestamp("allocateDate") ?: Timestamp(0),
                        rs.getTimestamp("pickupDate") ?: Timestamp(0),
                        rs.getTimestamp("completeDate") ?: Timestamp(0),
                        rs.getTimestamp("cancelDate") ?: Timestamp(0),
                        rs.getInt("deliveryCost"),
                        rs.getString("additionalCost"),
                        rs.getString("riderId") ?: "",
                        rs.getString("paymentType") ?: "",
                        rs.getString("memo") ?: ""
                )
                counts[Integer.parseInt(rs.getString("orderStatusId")) - 1]++
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