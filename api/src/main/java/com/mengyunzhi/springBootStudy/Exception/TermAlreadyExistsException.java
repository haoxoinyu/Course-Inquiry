package com.mengyunzhi.springBootStudy.Exception;

public class TermAlreadyExistsException extends RuntimeException {

    // 构造方法，接收错误信息
    public TermAlreadyExistsException(String message) {
        super(message);  // 调用父类构造方法传递错误信息
    }
}

