package com.please.dataAccess

import com.please.exception.SqlAbnormalResultException
import com.please.persistence.queryForJSONObject
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

    @Throws(SqlAbnormalResultException::class)
    fun getOrder(authKey: String, orderId: Int): String {
        return template.queryForJSONObject("CALL getOrder(?, ?)", authKey, orderId)
    }

    @Throws(SqlAbnormalResultException::class)
    fun setOrderStatus(authKey: String, data: String): String {
        return template.queryForJSONObject("CALL setOrderStatus(?, ?)", authKey, data)
    }

    @Throws(SqlAbnormalResultException::class)
    fun addOrder(authKey: String, orderInfo: String): String {
        return template.queryForJSONObject("CALL addOrder(?, ?)", authKey, orderInfo)
    }

    //검색 조건에 맞는 주문 목록 쿼리
    @Throws(SqlAbnormalResultException::class)
    fun searchOrders(branchId: String, conditionParseString: String): String {
        return template.queryForJSONObject("CALL getSearchedOrdersForWeb(getUserAuthKeyById(?), ?)", branchId, conditionParseString)
    }

    //검색 조건에 맞는 각각의 상태 개수 쿼리(검색 조건 중 날짜로만 필터)
    @Throws(SqlAbnormalResultException::class)
    fun getOrderStatusCounts(branchId: String, startTimestamp: Timestamp?, endTimestamp: Timestamp?): String {
        return template.queryForJSONObject("CALL getOrderInformationsByTimestamp(getUserAuthKeyById(?), ?, ?)", branchId, startTimestamp, endTimestamp)
    }

    @Throws(SqlAbnormalResultException::class)
    fun getSearchLogOrders(logCondition: String): String {
        return template.queryForJSONObject("CALL getSearchedLogOrders2(?)", logCondition)
    }
}