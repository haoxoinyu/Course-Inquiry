package com.mengyunzhi.springBootStudy.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashSet;
import java.util.UUID;

/**
 * 令牌过滤器
 * 继承HttpFilter以过滤http请求与响应
 * @author panjie
 */
@WebFilter
public class TokenFilter extends HttpFilter {

    /** 存储已分发过的令牌 */
    private HashSet<String> tokens = new HashSet<>();

    public static String TOKEN_KEY = "auth-token";

    private final static Logger logger = LoggerFactory.getLogger(TokenFilter.class);

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        // 获取 header中的token
        String token = request.getHeader(TOKEN_KEY);
        logger.info("获取到的token为" + token);

        // 有效性判断
        if (!this.validateToken(token)) {
            // 如果无效则分发送的token
            token = this.makeToken();
            logger.info("原token无效，发布的新的token为" + token);

            // 设置header中的auth-token
            request = new HttpServletRequestTokenWrapper(request, token);
        }
        logger.info("在控制器被调用以前执行");

        // 在确立响应信息前，设置响应的header值
        response.setHeader(TOKEN_KEY, token);

        // 转发数据。spring开始调用控制器中的特定方法
        chain.doFilter(request, response);

        logger.info("在控制器被调用以前执行");
    }

    /**
     * 验证token的有效性
     * @param token token
     * @return
     */
    private boolean validateToken(String token) {
        if (token == null) {
            return false;
        }

        return this.tokens.contains(token);
    }

    /**
     * 生成token
     * 将生成的token存入已分发的tokens中
     * @return token
     */
    private String makeToken() {
        String token = UUID.randomUUID().toString();
        this.tokens.add(token);
        return token;
    }

    /**
     * 带有请求token的Http请求
     */
    class HttpServletRequestTokenWrapper extends HttpServletRequestWrapper {
        HttpServletRequestWrapper httpServletRequestWrapper;
        String token;
        private HttpServletRequestTokenWrapper(HttpServletRequest request) {
            super(request);
        }

        public HttpServletRequestTokenWrapper(HttpServletRequest request, String token) {
            this(request);
            this.token = token;
        }

        @Override
        public String getHeader(String name) {
            if (TOKEN_KEY.equals(name)) {
                return this.token;
            }
            return super.getHeader(name);
        }
    }
}
