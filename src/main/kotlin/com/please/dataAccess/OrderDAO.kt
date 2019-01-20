package com.please.dataAccess

import com.please.persistence.queryForJSONObject
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.Timestamp

@Repository
class OrderDAO {
    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    fun getOrder(authKey: String, orderId: Int): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getOrder(?, ?)", authKey, orderId)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun setOrderStatus(authKey: String, data: String): JSONObject? {
        println(data)
//        try {
//            return template.queryForJSONObject("CALL setOrderStatus(?, ?)", authKey, jsonData)
//        } catch (e: Exception) {
//            e.printStackTrace()
//        }
        return null
    }

    fun addOrder(authKey: String, orderInfo: String): JSONObject? {
        try {
            return template.queryForJSONObject("CALL addOrder(?, ?)", authKey, orderInfo)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    //검색 조건에 맞는 주문 목록 쿼리
    fun searchOrders(branchId: String, conditionParseString: String): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getSearchedOrders(getUserAuthKeyById(?), ?)", branchId, conditionParseString)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    //검색 조건에 맞는 각각의 상태 개수 쿼리(검색 조건 중 날짜로만 필터)
    fun getOrderStatusCounts(branchId: String, startTimestamp: Timestamp?, endTimestamp: Timestamp?): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getOrderInformationsByTimestamp(getUserAuthKeyById(?), ?, ?)", branchId, startTimestamp, endTimestamp)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun getSearchLogOrders(logCondition: String): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getSearchedLogOrders2(?)", logCondition)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}