package com.please.controller.api

import com.please.exception.*
import com.please.persistence.getExceptionLog
import com.please.value.ErrorInfo
import org.apache.commons.logging.LogFactory
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.dao.DataAccessException
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.dao.IncorrectResultSizeDataAccessException
import org.springframework.dao.QueryTimeoutException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import javax.servlet.http.HttpServletRequest


@RestController
@RestControllerAdvice(basePackages = ["com.please.controller.api"])
@Order(Ordered.HIGHEST_PRECEDENCE)
class ExceptionRestController : ResponseEntityExceptionHandler() {
    private val log = LogFactory.getLog(ExceptionRestController::class.java)

    //사용자 그룹이 비정상적일 경우 발생
    @ExceptionHandler(GroupNotFoundException::class)
    fun groupError(e: GroupNotFoundException, req: HttpServletRequest): ResponseEntity<ErrorInfo> {
        log.error(getExceptionLog(e, req))
        return ResponseEntity(e.errorInfo, HttpStatus.BAD_REQUEST)
    }

    //로그인 세션이 만료된후 접근할 경우 발생
    @ExceptionHandler(SessionExpirationException::class)
    fun loginError(e: SessionExpirationException, req: HttpServletRequest): ResponseEntity<ErrorInfo> {
        log.error(getExceptionLog(e, req))
        return ResponseEntity(e.errorInfo, HttpStatus.BAD_REQUEST)
    }

    //DB 처리가 잘못되었을 경우 발생
    @ExceptionHandler(value = [EmptyResultDataAccessException::class,
        IncorrectResultSizeDataAccessException::class,
        DataAccessException::class])
    fun dbProcessError(e: Exception, req: HttpServletRequest): ResponseEntity<ErrorInfo> {
        log.error(getExceptionLog(e, req))
        return ResponseEntity(ErrorInfo(101), HttpStatus.INTERNAL_SERVER_ERROR)
    }

    //DB의 처리시간이 초과된 경우
    @ExceptionHandler(QueryTimeoutException::class)
    fun emptyResultError(e: QueryTimeoutException, req: HttpServletRequest): ResponseEntity<ErrorInfo> {
        log.error(getExceptionLog(e, req))
        return ResponseEntity(ErrorInfo(600), HttpStatus.INTERNAL_SERVER_ERROR)
    }

    //포인트 잔액이 부족할 경우
    @ExceptionHandler(MissingBalanceException::class)
    fun usePointError(e: MissingBalanceException, req: HttpServletRequest): ResponseEntity<ErrorInfo> {
        log.info(getExceptionLog(e, req))
        return ResponseEntity(e.errorInfo, HttpStatus.OK)
    }

    //프로시저 수행 중 프로시저에서 예상가능한 에러가 발생한 경우(디비 참조)
    @ExceptionHandler(SqlAbnormalResultException::class)
    fun abnormalResultError(e: SqlAbnormalResultException, req: HttpServletRequest): ResponseEntity<ErrorInfo> {
        log.error(getExceptionLog(e, req))
        return ResponseEntity(e.errorInfo, HttpStatus.OK)
    }

    //유저 계좌정보가 확인되지 않을 경우
    @ExceptionHandler(AccountNotFoundException::class)
    fun accountNotFound(e: AccountNotFoundException, req: HttpServletRequest): ResponseEntity<ErrorInfo> {
        log.info(getExceptionLog(e, req))
        return ResponseEntity(e.errorInfo, HttpStatus.OK)
    }

    //유효하지 않은 데이터 값의 연산이 발생할 경우
    @ExceptionHandler(InvalidValueException::class)
    fun invalidValueError(e: InvalidValueException, req: HttpServletRequest): ResponseEntity<ErrorInfo> {
        log.error(getExceptionLog(e, req))
        return ResponseEntity(e.errorInfo, HttpStatus.BAD_REQUEST)
    }

    //패스워드가 일치하지 않을 경우
    @ExceptionHandler(PasswordMismatchException::class)
    fun passwordMismatch(e: PasswordMismatchException, req: HttpServletRequest): ResponseEntity<ErrorInfo> {
        log.error(getExceptionLog(e, req))
        return ResponseEntity(e.errorInfo, HttpStatus.OK)
    }

    //패스워드가 등록되지 않은 경우
    @ExceptionHandler(PasswordNotFoundException::class)
    fun passwordNotFound(e: PasswordNotFoundException, req: HttpServletRequest): ResponseEntity<ErrorInfo> {
        log.error(getExceptionLog(e, req))
        return ResponseEntity(e.errorInfo, HttpStatus.OK)
    }

    //기타 에러가 발생할 경우
    @ExceptionHandler(Exception::class)
    fun unknownError(e: Exception, req: HttpServletRequest): ResponseEntity<ErrorInfo> {
        log.error(getExceptionLog(e, req))
        return ResponseEntity(ErrorInfo(777), HttpStatus.INTERNAL_SERVER_ERROR)
    }
}