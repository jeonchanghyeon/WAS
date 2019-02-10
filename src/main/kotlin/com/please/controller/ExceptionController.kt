package com.please.controller

import com.please.exception.GroupNotFoundException
import com.please.exception.SessionExpirationException
import com.please.persistence.getExceptionLog
import org.apache.commons.logging.LogFactory
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import javax.servlet.http.HttpServletRequest

@Controller
@ControllerAdvice
class ExceptionController : ResponseEntityExceptionHandler() {
    private val log = LogFactory.getLog(ExceptionController::class.java)

    //사용자의 소속이 정상적이지 않아 페이지를 표시할 수 없을 경우
    @ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Could not verify user's group")
    @ExceptionHandler(GroupNotFoundException::class)
    fun groupError(e: GroupNotFoundException, req: HttpServletRequest) {
        log.error(getExceptionLog(e, req))
    }

    //사용자를 확인할 수 없어 페이지를 표시할 수 없을 경우
    @ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Could not verify user")
    @ExceptionHandler(SessionExpirationException::class)
    fun loginError(e: SessionExpirationException, req: HttpServletRequest) {
        log.error(getExceptionLog(e, req))
    }

    //기타 에러가 발생하여 페이지를 표시할 수 없을 경우
    @ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Unknown Error")
    @ExceptionHandler(Exception::class)
    fun unknownError(e: Exception, req: HttpServletRequest) {
        log.error(getExceptionLog(e, req))
    }
}