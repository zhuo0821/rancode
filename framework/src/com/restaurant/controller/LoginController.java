package com.restaurant.controller;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

import com.restaurant.bean.User;


public class LoginController extends AbstractController {

	private JdbcTemplate jdbcTemplate;
	private final Log logger = LogFactory.getLog(LoginController.class); 

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	protected ModelAndView handleRequestInternal(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		User user = null;
		String errorString = "";
		int result = -1;
		String loginName = request.getParameter("loginName");
		loginName = URLDecoder.decode(loginName,"UTF-8");
		String password = request.getParameter("password");
		boolean ckCookie = request.getParameter("ckCookie") == null ? false
				: Boolean.parseBoolean(request.getParameter("ckCookie"));
		String kaptcha = request.getParameter("kaptcha");
		String kaptchaExpected = (String) request.getSession().getAttribute(com.google.code.kaptcha.Constants.KAPTCHA_SESSION_KEY);
		try {
			response.setCharacterEncoding("UTF-8");
			String str = "";
			String sql = "select user.id userid,user.name username,user.s_id org_id,user.loginname,user.password,user.role_id,store.name s_name,store.phone,store.address from user,store where store.id = user.s_id and user.loginname = ?";
			System.out.println(sql);
			try {
				if(kaptchaExpected.equalsIgnoreCase(kaptcha)) {
					user = jdbcTemplate.queryForObject(sql,
							BeanPropertyRowMapper.newInstance(User.class),
							loginName);
					if (!user.getPassWord().equals(password))
						errorString = "密码错误！";
					else
						result = 0;
				} else {
					errorString = "验证码错误！";
				}
			} catch (EmptyResultDataAccessException e) {
				errorString = "用户不存在！";
			}
			if (result == 0 && user != null) {
				HttpSession session = request.getSession();
				/*
				sql = "select game.* , arena_id from game inner join competition on game.competition_id=competition.id where game.status=1";
				List<Map<String,Object>> results = jdbcTemplate.queryForList(sql);
				if(results != null){
					Map<String,Object> r = results.get(0);
					session.setAttribute("gameId", r.get("id").toString());
					session.setAttribute("areaId", r.get("arena_id").toString());
					session.setAttribute("competitionId", r.get("competition_id").toString());
					session.setAttribute("round", r.get("round").toString());
					session.setAttribute("typeId", r.get("type_id").toString());
					session.setAttribute("gameName", r.get("name").toString());
					session.setAttribute("specialType", r.get("special_type").toString());
				}
				*/
				user.setIp(request.getRemoteAddr());
				session.setMaxInactiveInterval(-1);
				session.setAttribute("userInfo", user);
				//
				str = "{\"success\": true,\"roleId\" : "+user.getRoleId()+"}";
				logger.info(loginName + "@" + request.getRemoteAddr()+"登录系统");
			} else if (result == -1) {
				str = "{\"success\": false,\"errors\": {\"loginName\": \""
						+ loginName + "\",\"errorString\": \"" + errorString
						+ "\"}}";
			}
			if (result == 0 && ckCookie) {// 保存登录信息，写入Cookie
				Cookie cookie = new Cookie("username", URLEncoder.encode(loginName,"UTF-8"));
				Cookie cookiep = new Cookie("password", password);
				// 设置 cookie MaxAge
				cookie.setMaxAge(360 * 24 * 60 * 60); // 设置过期之前的最长时间
				cookiep.setMaxAge(360 * 24 * 60 * 60);
				// 添加Cookie
				response.addCookie(cookie);
				response.addCookie(cookiep);
			} else { // 不保存登录信息，清Cookie
				Cookie cookie = new Cookie("username", "noBoss");
				Cookie cookiep = new Cookie("password", "noBoss");
				// 设置 cookie MaxAge
				cookie.setMaxAge(360 * 24 * 60 * 60); // 设置过期之前的最长时间
				cookiep.setMaxAge(360 * 24 * 60 * 60);
				// 添加Cookie
				response.addCookie(cookie);
				response.addCookie(cookiep);
			}
			response.getWriter().print(str);
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return null;
	}
}
